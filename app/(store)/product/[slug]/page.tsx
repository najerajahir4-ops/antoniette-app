import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/store/AddToCartButton'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProductoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  })

  if (!product || !product.isActive) {
    notFound()
  }

  let images: string[] = []
  try {
    images = JSON.parse(product.images as string) || []
  } catch (e) {}

  const mainImage = images[0] || '/placeholder.png'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden bg-surface border border-surface-border shadow-2xl">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-surface-border opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Producto Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-accent text-sm font-bold uppercase tracking-wider">
              {product.category?.name || 'Accessories'}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-foreground/90 mb-8">
            ${product.price.toFixed(2)}
          </p>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed text-foreground/70">
              {product.description}
            </p>
          </div>

          <div className="h-px w-full bg-surface-border my-8" />

          <AddToCartButton product={product} imageUrl={mainImage} />
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-foreground/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Envío en 24 horas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Transacción segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
