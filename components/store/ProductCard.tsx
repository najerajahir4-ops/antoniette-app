'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCart(state => state.addItem)
  
  let imageUrl = '/placeholder.png'
  try {
    const images = JSON.parse(product.images as string)
    if (images && images.length > 0) imageUrl = images[0]
  } catch (e) {}

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to product detail
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stock: product.stock,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface/50 border border-surface-border">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {product.stock === 0 && (
            <div className="absolute top-4 left-4">
              <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Agotado
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex justify-end opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-accent/90 hover:bg-accent backdrop-blur-md text-white p-3 rounded-xl shadow-lg shadow-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-1">{product.name}</h3>
          <p className="text-sm font-semibold text-accent">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
