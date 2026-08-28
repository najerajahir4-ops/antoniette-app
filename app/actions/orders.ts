'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (newStatus === 'PENDING' || newStatus === 'PAID') {
    return { error: 'No se puede establecer este estado manualmente' }
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })
    revalidatePath('/admin/orders')
    revalidatePath('/profile')
    return { success: true }
  } catch (error: any) {
    console.error('Update order status error:', error)
    return { error: 'Failed to update order status' }
  }
}
