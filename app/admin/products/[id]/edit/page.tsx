import { prisma } from '@/lib/prisma'
import { ProductForm } from '../../ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  return <ProductForm initialData={product} categories={categories} />
}
