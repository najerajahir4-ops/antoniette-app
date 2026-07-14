'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'global' },
    })

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'global',
        },
      })
    }

    return { settings, error: null }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return { settings: null, error: 'No se pudieron cargar las configuraciones.' }
  }
}

export async function updateSettings(data: {
  storeName: string
  storeAddress: string
  storePhone: string
  openingTime: string
  closingTime: string
  reservationMaxAdvanceDays: number
  taxPercentage: number
}) {
  try {
    const updated = await prisma.storeSettings.update({
      where: { id: 'global' },
      data: {
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storePhone: data.storePhone,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        reservationMaxAdvanceDays: data.reservationMaxAdvanceDays,
        taxPercentage: data.taxPercentage,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/settings')
    revalidatePath('/reservar')
    
    return { success: true, settings: updated }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Hubo un error al guardar la configuración.' }
  }
}
