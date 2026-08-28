'use server'

import { prisma } from '@/lib/prisma'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { revalidatePath } from 'next/cache'

// Helper to get authenticated user from session
async function getAuthUser() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    select: { isActive: true }
  })
  
  if (!user || !user.isActive) return null

  return { id: payload.sub as string, role: payload.role as string }
}

export async function getAvailableTables(dateStr: string, timeStr: string) {
  try {
    if (!dateStr || !timeStr) return { error: 'Fecha y hora son requeridas' }

    // Parse date ensuring local time range comparison
    const targetDate = new Date(dateStr)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    // Get all reservations for that day that are not cancelled
    const activeReservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELADA',
        },
      },
      select: {
        tableId: true,
        time: true,
      },
    })

    const [reqHours, reqMinutes] = timeStr.split(':').map(Number)
    const reqTimeInMinutes = reqHours * 60 + reqMinutes

    const reservedTableIds = activeReservations.filter((res) => {
      const [resHours, resMinutes] = res.time.split(':').map(Number)
      const resTimeInMinutes = resHours * 60 + resMinutes
      // Conflict if absolute difference in minutes is less than 120 (2 hours)
      return Math.abs(reqTimeInMinutes - resTimeInMinutes) < 120
    }).map((r) => r.tableId)

    // Get all tables and mark availability
    const allTables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
    })

    const tablesWithAvailability = allTables.map((table) => ({
      ...table,
      isAvailable: !reservedTableIds.includes(table.id) && table.status === 'DISPONIBLE',
    }))

    return { tables: tablesWithAvailability }
  } catch (error: any) {
    console.error('Error fetching available tables:', error)
    return { error: 'Error al buscar disponibilidad' }
  }
}

export async function createReservation(formData: {
  tableId: string
  dateStr: string
  timeStr: string
  guests: number
}) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return { error: 'Debes iniciar sesión para realizar una reserva', code: 'UNAUTHORIZED' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerified: true }
    })

    if (!dbUser || !dbUser.emailVerified) {
      return { error: 'Verifica tu correo electrónico para poder reservar', code: 'EMAIL_UNVERIFIED' }
    }

    const { tableId, dateStr, timeStr, guests } = formData

    if (!tableId || !dateStr || !timeStr || !guests) {
      return { error: 'Todos los campos son requeridos' }
    }

    // Validate table exists and check capacity
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    })

    if (!table) {
      return { error: 'La mesa seleccionada no existe' }
    }

    if (guests > table.capacity) {
      return { error: `La mesa seleccionada solo tiene capacidad para ${table.capacity} personas` }
    }

    // Double check availability
    const targetDate = new Date(dateStr)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    // Validar configuraciones globales
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'global' } })
    if (settings) {
      const today = new Date()
      const todayStart = new Date(today.setHours(0, 0, 0, 0))
      
      const maxDate = new Date(todayStart)
      maxDate.setDate(todayStart.getDate() + settings.reservationMaxAdvanceDays)
      
      if (startOfDay < todayStart) {
        return { error: 'No puedes realizar reservas en el pasado.' }
      }
      
      if (startOfDay > maxDate) {
        return { error: `Solo puedes reservar con un máximo de ${settings.reservationMaxAdvanceDays} días de anticipación.` }
      }

      // Validar horario de apertura
      const [reqH, reqM] = timeStr.split(':').map(Number)
      const [openH, openM] = settings.openingTime.split(':').map(Number)
      const [closeH, closeM] = settings.closingTime.split(':').map(Number)
      
      const reqTime = reqH * 60 + reqM
      const openTime = openH * 60 + openM
      const closeTime = closeH * 60 + closeM
      
      const isOvernight = closeTime < openTime
      
      const isClosed = isOvernight 
        ? (reqTime < openTime && reqTime > closeTime)
        : (reqTime < openTime || reqTime > closeTime)

      if (isClosed) {
        return { error: `El horario de atención es de ${settings.openingTime} a ${settings.closingTime}.` }
      }
    }

    const [reqHours, reqMinutes] = timeStr.split(':').map(Number)
    const reqTimeInMinutes = reqHours * 60 + reqMinutes

    const existingReservations = await prisma.reservation.findMany({
      where: {
        tableId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELADA',
        },
      },
      select: { time: true }
    })

    const hasConflict = existingReservations.some((res) => {
      const [resHours, resMinutes] = res.time.split(':').map(Number)
      const resTimeInMinutes = resHours * 60 + resMinutes
      return Math.abs(reqTimeInMinutes - resTimeInMinutes) < 120
    })

    if (hasConflict) {
      return { error: 'Esta mesa ya está reservada en un horario cercano (se requiere un margen de 2 horas)' }
    }

    // Create reservation (directly CONFIRMADA as per requirements)
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        tableId,
        date: new Date(dateStr),
        time: timeStr,
        guests,
        status: 'CONFIRMADA',
      },
    })

    revalidatePath('/mis-reservas')
    revalidatePath('/empleado')
    return { success: true, reservation }
  } catch (error: any) {
    console.error('Error creating reservation:', error)
    return { error: 'Ocurrió un error al crear la reserva' }
  }
}

export async function getUserReservations() {
  try {
    const user = await getAuthUser()
    if (!user) return { error: 'No autorizado', code: 'UNAUTHORIZED' }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        table: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return { reservations }
  } catch (error) {
    console.error('Error getting user reservations:', error)
    return { error: 'Error al obtener historial' }
  }
}

export async function cancelReservation(reservationId: string) {
  try {
    const user = await getAuthUser()
    if (!user) return { error: 'No autorizado', code: 'UNAUTHORIZED' }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { table: true },
    })

    if (!reservation) {
      return { error: 'Reserva no encontrada' }
    }

    // Auth check: user can only cancel their own reservations unless they are Admin/Employee
    if (reservation.userId !== user.id && user.role === 'CLIENTE') {
      return { error: 'No tienes permisos para cancelar esta reserva' }
    }

    // Time validation: client can only cancel if there's > 2 hours left
    if (user.role === 'CLIENTE') {
      const resDateTime = new Date(reservation.date)
      // Parse hours and minutes from time string (e.g. "19:30")
      const [hours, minutes] = reservation.time.split(':').map(Number)
      resDateTime.setHours(hours, minutes, 0, 0)

      const diffMs = resDateTime.getTime() - Date.now()
      const diffHours = diffMs / (1000 * 60 * 60)

      if (diffHours < 2) {
        return { error: 'Las reservas solo se pueden cancelar con más de 2 horas de anticipación' }
      }
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CANCELADA' },
    })

    revalidatePath('/mis-reservas')
    revalidatePath('/empleado')
    return { success: true }
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return { error: 'Ocurrió un error al cancelar la reserva' }
  }
}
