'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { productSchema } from '@/lib/validations/product'
import { uploadFile } from '@/lib/storage'
import { redirect } from 'next/navigation'

export async function createProducto(formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      categoryId: formData.get('categoryId'),
      isActivo: formData.get('isActivo') === 'on',
    }

    const parsed = productSchema.parse(data)

    // Handle image upload
    const imageFile = formData.get('imageFile') as File | null
    let images: string[] = []
    
    if (imageFile && imageFile.size > 0) {
      const url = await uploadFile(imageFile)
      images.push(url)
    }

    await prisma.product.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description,
        price: parsed.price,
        stock: parsed.stock,
        categoryId: parsed.categoryId,
        isActive: parsed.isActive,
        images: JSON.stringify(images),
      }
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    console.error('Create product error:', error)
    return { error: error.message || 'Failed to create product' }
  }
}

export async function updateProducto(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      categoryId: formData.get('categoryId'),
      isActivo: formData.get('isActivo') === 'on',
    }

    const parsed = productSchema.parse(data)
    
    const existingProducto = await prisma.product.findUnique({ where: { id } })
    if (!existingProducto) throw new Error('Producto not found')

    let images: string[] = JSON.parse(existingProducto.images || '[]')

    // Handle new image upload
    const imageFile = formData.get('imageFile') as File | null
    if (imageFile && imageFile.size > 0) {
      const url = await uploadFile(imageFile)
      // For simplicity in this phase, replace the existing image or add to array
      images = [url]
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description,
        price: parsed.price,
        stock: parsed.stock,
        categoryId: parsed.categoryId,
        isActive: parsed.isActive,
        images: images ? JSON.stringify(images) : undefined,
      }
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    console.error('Update product error:', error)
    return { error: error.message || 'Failed to update product' }
  }
}

export async function deleteProducto(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    console.error('Delete product error:', error)
    return { error: error.message || 'Failed to delete product' }
  }
}
