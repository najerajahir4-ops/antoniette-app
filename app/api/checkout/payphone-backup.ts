import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { items } = await req.json()
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    if (!process.env.PAYPHONE_TOKEN) {
      return NextResponse.json({ error: 'Payphone no configurado. Agrega PAYPHONE_TOKEN a .env' }, { status: 500 })
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ecommerce_session')?.value
    let userId = null
    
    if (sessionCookie) {
      const payload = await verifyToken(sessionCookie)
      userId = payload?.sub as string
    }

    // Calculate total
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    
    // Create pending order
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // Prepare Payphone payload (Amount in cents)
    const amountInCents = Math.round(totalAmount * 100)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const payphonePayload = {
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      clientTransactionId: order.id,
      currency: "USD",
      responseUrl: `${baseUrl}/api/webhooks/payphone`,
      cancellationUrl: `${baseUrl}/cart?canceled=true`
    }

    // Call Payphone API
    const payphoneRes = await fetch('https://pay.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYPHONE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payphonePayload)
    })

    if (!payphoneRes.ok) {
      const errorText = await payphoneRes.text()
      console.error('Payphone API error:', errorText)
      throw new Error('Error al conectar con Payphone')
    }

    const data = await payphoneRes.json()

    // data.paymentUrl is the URL where the user should be redirected
    return NextResponse.json({ paymentUrl: data.paymentUrl })

  } catch (error: any) {
    console.error('Payphone checkout error:', error)
    return NextResponse.json({ error: 'Ocurrió un error al procesar el pago.' }, { status: 500 })
  }
}
