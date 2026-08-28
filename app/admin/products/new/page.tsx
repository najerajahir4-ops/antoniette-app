import { prisma } from '@/lib/prisma'
import { ProductForm } from '../ProductForm'

export default async function NewProductoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  // Ensure at least one category exists for testing if DB is empty
  if (categories.length === 0) {
    const defaultCat = await prisma.category.create({
      data: { name: 'General', slug: 'general' }
    })
    categories.push(defaultCat)
  }

  return <ProductForm categories={categories} />
}
