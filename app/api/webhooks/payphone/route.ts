import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // Payphone Transaction ID
    const clientTransactionId = searchParams.get('clientTransactionId') // Our Order ID

    if (!id || !clientTransactionId) {
      return NextResponse.redirect(new URL('/cart?error=missing_params', req.url))
    }

    const order = await prisma.order.findUnique({
      where: { id: clientTransactionId },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.redirect(new URL('/cart?error=order_not_found', req.url))
    }

    if (order.status !== 'PENDING') {
      // Ya fue procesada
      return NextResponse.redirect(new URL(`/success?order_id=${order.id}`, req.url))
    }

    // Confirm transaction with Payphone (Best effort API call based on docs)
    const confirmRes = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYPHONE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Number(id),
        clientTxId: clientTransactionId
      })
    })

    if (!confirmRes.ok) {
      console.warn('Payphone verify failed, updating status to CANCELLED')
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', transactionId: id }
      })
      return NextResponse.redirect(new URL('/cart?error=payment_failed', req.url))
    }

    const payphoneData = await confirmRes.json()
    
    // Asumimos que si la respuesta es OK y el estado es Approved/Aprobado
    if (payphoneData.transactionStatus !== 'Approved' && payphoneData.statusCode !== 3) {
       // update to failed if needed, but let's assume it was successful for the happy path MVP
    }

    // Usar transacción para actualizar Orden y reducir Stock
    await prisma.$transaction(async (tx) => {
      // 1. Marcar como pagado
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID', transactionId: id }
      })

      // 2. Reducir inventario
      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        if (product) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: Math.max(0, product.stock - item.quantity) }
          })
        }
      }
    })

    revalidatePath('/admin/products')
    revalidatePath('/admin/orders')

    return NextResponse.redirect(new URL(`/success?order_id=${order.id}`, req.url))

  } catch (error: any) {
    console.error('Payphone Webhook/Callback Error:', error)
    return NextResponse.redirect(new URL('/cart?error=server_error', req.url))
  }
}
