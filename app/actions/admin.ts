'use server'

import { prisma } from '@/lib/prisma'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { revalidatePath } from 'next/cache'

async function checkAdminAuth() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload || payload.role !== 'ADMIN') return null
  return payload
}

// --- TABLES CRUD ---

export async function getAdminTables() {
  const auth = await checkAdminAuth()
  if (!auth) return { error: 'No autorizado' }
  const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } })
  return { tables }
}

export async function createTable(number: number, capacity: number) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    if (!number || !capacity) return { error: 'Número y capacidad son obligatorios' }

    const exists = await prisma.table.findUnique({ where: { number } })
    if (exists) return { error: 'Ya existe una mesa con este número' }

    const table = await prisma.table.create({
      data: { number, capacity },
    })

    revalidatePath('/admin/tables')
    revalidatePath('/reservar')
    return { success: true, table }
  } catch (error) {
    return { error: 'Error al crear la mesa' }
  }
}

export async function updateTable(id: string, number: number, capacity: number, status: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    const exists = await prisma.table.findFirst({
      where: { number, id: { not: id } }
    })
    if (exists) return { error: 'Ya existe otra mesa con este número' }

    const table = await prisma.table.update({
      where: { id },
      data: { number, capacity, status },
    })

    revalidatePath('/admin/tables')
    revalidatePath('/reservar')
    return { success: true, table }
  } catch (error) {
    return { error: 'Error al actualizar la mesa' }
  }
}

export async function deleteTable(id: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    // Check if table has active reservations
    const reservations = await prisma.reservation.findFirst({
      where: { tableId: id, status: { not: 'CANCELADA' } }
    })
    if (reservations) {
      return { error: 'No se puede eliminar la mesa porque tiene reservaciones activas' }
    }

    await prisma.table.delete({ where: { id } })
    revalidatePath('/admin/tables')
    return { success: true }
  } catch (error) {
    return { error: 'Error al eliminar la mesa' }
  }
}

// --- REVIEWS MODERATION ---

export async function getAdminReviews() {
  const auth = await checkAdminAuth()
  if (!auth) return { error: 'No autorizado' }
  const reviews = await prisma.review.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return { reviews }
}

export async function toggleReviewVisibility(reviewId: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) return { error: 'Reseña no encontrada' }

    await prisma.review.update({
      where: { id: reviewId },
      data: { hidden: !review.hidden }
    })

    revalidatePath('/admin/reviews')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Error al actualizar visibilidad de la reseña' }
  }
}

// --- EMPLOYEES & USERS ---

export async function getAdminUsers() {
  const auth = await checkAdminAuth()
  if (!auth) return { error: 'No autorizado' }
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
  return { users }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    const validRoles = ['CLIENTE', 'EMPLEADO', 'ADMIN']
    if (!validRoles.includes(role)) return { error: 'Rol no válido' }

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    revalidatePath('/admin/employees')
    return { success: true }
  } catch (error) {
    return { error: 'Error al actualizar el rol' }
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { error: 'Usuario no encontrado' }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    })

    revalidatePath('/admin/employees')
    return { success: true }
  } catch (error) {
    return { error: 'Error al cambiar estado del usuario' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    // Verificar si el usuario tiene historial relacionado
    const hasOrders = await prisma.order.findFirst({ where: { userId } })
    const hasReservations = await prisma.reservation.findFirst({ where: { userId } })
    const hasReviews = await prisma.review.findFirst({ where: { userId } })

    if (hasOrders || hasReservations || hasReviews) {
      // Tiene historial: aplicar Soft Delete (isActive: false)
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      })
      revalidatePath('/admin/employees')
      return { 
        success: true, 
        softDeleted: true, 
        message: 'El usuario posee historial activo (órdenes, reservas o reseñas). Se aplicó desactivación de cuenta (Soft Delete).' 
      }
    }

    // Sin historial: realizar eliminación física segura
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath('/admin/employees')
    return { 
      success: true, 
      softDeleted: false, 
      message: 'Usuario sin historial eliminado permanentemente de la base de datos.' 
    }
  } catch (error) {
    return { error: 'Error al procesar la eliminación del usuario' }
  }
}

// --- REPORTS ---

export async function getAdminReport() {
  try {
    const auth = await checkAdminAuth()
    if (!auth) return { error: 'No autorizado' }

    // Reservations by day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const reservations = await prisma.reservation.findMany({
      where: { date: { gte: sevenDaysAgo } }
    })

    const reviews = await prisma.review.findMany()
    const tablesCount = await prisma.table.count()

    const totalReviews = reviews.length
    const avgRating = totalReviews > 0 
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
      : 0

    return {
      reservationsCount: reservations.length,
      avgRating: avgRating.toFixed(1),
      tablesCount,
      totalReviews
    }
  } catch (error) {
    return { error: 'Error al cargar reporte' }
  }
}
