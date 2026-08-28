'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  if (!name || !slug) return { error: 'Nombre y Slug son requeridos' }

  try {
    await prisma.category.create({
      data: { name, slug, description }
    })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Create category error:', error)
    return { error: 'Error al crear la categoría (quizás el slug ya existe)' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Delete category error:', error)
    return { error: 'No se puede eliminar la categoría. ¿Asegúrate de que no tenga productos asociados?' }
  }
}
