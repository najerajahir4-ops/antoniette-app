'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { Button } from '../ui/Button'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCart()

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      
      const { paymentUrl, error } = await response.json()
      
      if (error) {
        console.error('Checkout error:', error)
        alert('Error en el checkout: ' + error)
        return
      }

      if (paymentUrl) {
        window.location.href = paymentUrl
      }
    } catch (err) {
      console.error(err)
      alert('Error de red durante el checkout')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-surface-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-border/50">
              <h2 className="text-xl font-semibold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" /> Tu Carrito
              </h2>
              <button onClick={onClose} className="p-2 text-foreground/50 hover:text-foreground rounded-full hover:bg-surface-border/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/50 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Tu carrito está vacío.</p>
                  <Button onClick={onClose} variant="secondary" className="mt-4">
                    Continue Tiendaping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-surface-border bg-surface-border/10">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg bg-surface-border/50"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-foreground/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-surface rounded-lg border border-surface-border/50 p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-surface-border rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-surface-border rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-accent">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-surface-border/50 bg-surface/50 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="text-xl font-bold">${getTotal().toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full h-12 text-lg font-medium shadow-lg shadow-accent/20">
                  Pagar con Stripe
                </Button>
                <p className="text-xs text-center text-foreground/40 mt-4">
                  Envío e impuestos se calculan al pagar.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
