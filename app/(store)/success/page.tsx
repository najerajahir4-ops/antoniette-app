'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const clearCart = useCart(state => state.clearCart)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [clearCart, cleared])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-surface/80 backdrop-blur-xl border border-surface-border p-8 rounded-3xl shadow-2xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">¡Orden Confirmada!</h1>
        <p className="text-foreground/70">
          Gracias por tu compra. Hemos recibido tu orden y la procesaremos de inmediato.
        </p>

        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
          >
            Continue Tiendaping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
