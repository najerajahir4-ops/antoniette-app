import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Colecciones | LUXE',
  description: 'Explora todas nuestras colecciones y categorías exclusivas.',
}

export default async function CollectionsPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Dummy images since categories don't have images in the schema yet
  const defaultImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
  ]

  return (
    <div className="pb-24 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Nuestras Colecciones
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Explora las categorías diseñadas especialmente para ti. Encuentra lo que buscas
            en nuestras selecciones exclusivas.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-24 text-foreground/50 bg-surface/30 rounded-3xl border border-surface-border border-dashed">
            No hay colecciones disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <Link key={category.id} href={`/#collection`} className="group block">
                <div className="relative h-80 rounded-3xl overflow-hidden mb-4 bg-surface border border-surface-border">
                  <img 
                    src={defaultImages[idx % defaultImages.length]} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-white/70 text-sm">{category._count.products} productos</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
