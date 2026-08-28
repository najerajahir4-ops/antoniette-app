'use server'

import { prisma } from '@/lib/prisma'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { revalidatePath } from 'next/cache'

async function checkEmployeeAuth() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null
  if (payload.role !== 'EMPLEADO' && payload.role !== 'ADMIN') return null
  return payload
}

export async function getEmployeeDashboardData() {
  try {
    const auth = await checkEmployeeAuth()
    if (!auth) return { error: 'No autorizado' }

    // Today range
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const [tables, todayReservations] = await Promise.all([
      prisma.table.findMany({
        orderBy: { number: 'asc' },
      }),
      prisma.reservation.findMany({
        where: {
          date: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        include: {
          user: {
            select: { email: true },
          },
          table: true,
        },
        orderBy: {
          time: 'asc',
        },
      }),
    ])

    return { tables, reservations: todayReservations }
  } catch (error) {
    console.error('Error fetching employee dashboard data:', error)
    return { error: 'Error al obtener los datos del panel' }
  }
}

export async function updateTableStatus(tableId: string, status: string) {
  try {
    const auth = await checkEmployeeAuth()
    if (!auth) return { error: 'No autorizado' }

    const validStatuses = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'LIMPIEZA', 'FUERA_DE_SERVICIO']
    if (!validStatuses.includes(status)) {
      return { error: 'Estado de mesa no válido' }
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { status },
    })

    revalidatePath('/empleado')
    revalidatePath('/reservar')
    return { success: true, table: updatedTable }
  } catch (error) {
    console.error('Error updating table status:', error)
    return { error: 'Error al actualizar el estado de la mesa' }
  }
}

export async function updateReservationStatus(reservationId: string, status: string) {
  try {
    const auth = await checkEmployeeAuth()
    if (!auth) return { error: 'No autorizado' }

    const validStatuses = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA']
    if (!validStatuses.includes(status)) {
      return { error: 'Estado de reserva no válido' }
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
    })

    revalidatePath('/empleado')
    revalidatePath('/mis-reservas')
    return { success: true, reservation: updatedReservation }
  } catch (error) {
    console.error('Error updating reservation status:', error)
    return { error: 'Error al actualizar el estado de la reserva' }
  }
}
