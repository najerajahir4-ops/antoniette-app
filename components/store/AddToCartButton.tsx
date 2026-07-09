'use client'

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import { Product } from '@prisma/client'
import { motion } from 'framer-motion'

interface AddToCartButtonProps {
  product: Product
  imageUrl: string
}

export function AddToCartButton({ product, imageUrl }: AddToCartButtonProps) {
  const [quantity, setCantidad] = useState(1)
  const addItem = useCart(state => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity,
      stock: product.stock,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full h-14 text-lg bg-surface-border text-foreground/50 border-none">
        Agotado
      </Button>
    )
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-foreground/70">Cantidad</span>
        <div className="flex items-center space-x-2 bg-surface/50 border border-surface-border rounded-lg p-1 backdrop-blur-sm">
          <button 
            onClick={() => setCantidad(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-surface-border/50 rounded-md transition-colors text-foreground/70"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
          <button 
            onClick={() => setCantidad(Math.min(product.stock, quantity + 1))}
            className="p-2 hover:bg-surface-border/50 rounded-md transition-colors text-foreground/70"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-foreground/40">{product.stock} disponibles</span>
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button 
          onClick={handleAdd}
          className={`w-full h-14 text-lg font-medium shadow-xl transition-all ${
            isAdded ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20 text-white border-transparent' : 'shadow-accent/20'
          }`}
        >
          {isAdded ? (
            '¡Agregado!'
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-3" />
              Agregar - ${(product.price * quantity).toFixed(2)}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
