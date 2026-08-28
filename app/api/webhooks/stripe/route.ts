import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2025-01-27.acacia' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    if (!webhookSecret) {
      console.error('Falta configurar STRIPE_WEBHOOK_SECRET')
      return NextResponse.json({ error: 'Webhook secret is not set' }, { status: 400 })
    }

    // 1. Recibir el evento raw como texto (requerido para verificar la firma de Stripe)
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event

    // 2. Verificar la firma del webhook
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      // 3. Si la firma es inválida, retornar 400 inmediatamente
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 4. Escuchar el evento checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const orderId = session.metadata?.orderId
      
      if (orderId) {
        // Única fuente de verdad para marcar una orden como pagada
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            transactionId: session.id, // Guardamos el ID de sesión de Stripe para trazabilidad
          }
        })
        console.log(`Orden ${orderId} marcada como PAID exitosamente mediante webhook.`)
      }
    }

    // 5. Retornar 200 rápido para que Stripe no reintente
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error: any) {
    console.error('Error en el webhook de Stripe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
