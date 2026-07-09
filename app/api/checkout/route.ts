import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2025-01-27.acacia' as any, // use appropriate API version or bypass typing
})

export async function POST(req: Request) {
  try {
    const { items } = await req.json()
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY no está configurada, usando modo de prueba falso (fallará la creación de sesión)')
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ecommerce_session')?.value
    let userId = null
    
    if (sessionCookie) {
      const payload = await verifyToken(sessionCookie)
      userId = payload?.sub as string
    }

    // Calcular total y crear la orden en la BD primero
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Formatear items para Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }))

    // Crear sesión de Checkout de Stripe
    let sessionUrl = ''
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_dummy_key') {
      console.warn('STRIPE_SECRET_KEY no configurada. Simulando redirección a Stripe...')
      // Simular un pago exitoso redirigiendo directamente a la URL de éxito
      sessionUrl = `${baseUrl}/success?session_id=simulated_session_123&order_id=${order.id}`
    } else {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${baseUrl}/cart?canceled=true`,
        metadata: {
          orderId: order.id,
          userId: userId || 'guest',
        },
      })
      sessionUrl = session.url as string
    }

    return NextResponse.json({ paymentUrl: sessionUrl })

  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Ocurrió un error al procesar el pago con Stripe. Revisa la configuración de tus llaves.' }, { status: 500 })
  }
}
