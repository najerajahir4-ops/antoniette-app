'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, LogOut, LayoutDashboard, Receipt } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { CartDrawer } from '../cart/CartDrawer'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function Navbar({ user }: { user: any }) {
  const items = useCart(state => state.items)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-surface/90 backdrop-blur-md border-b border-surface-border shadow-lg shadow-black/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              LUXE
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                Tienda
              </Link>
              <Link href="/collections" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                Colecciones
              </Link>
              <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                Nosotros
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={menuRef}>
                {user ? (
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-foreground/80 hover:text-accent transition-colors p-2 hover:bg-surface-border/50 rounded-full"
                  >
                    <User className="w-5 h-5" />
                  </button>
                ) : (
                  <Link href="/login" className="text-foreground/80 hover:text-accent transition-colors p-2 hover:bg-surface-border/50 rounded-full">
                    <User className="w-5 h-5" />
                  </Link>
                )}

                <AnimatePresence>
                  {isMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-surface-border rounded-xl shadow-xl py-2"
                    >
                      <Link 
                        href="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-surface-border hover:text-foreground transition-colors"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Mis Órdenes
                      </Link>
                      
                      {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                        <Link 
                          href="/admin" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-surface-border hover:text-foreground transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Panel Admin
                        </Link>
                      )}
                      
                      <div className="h-px bg-surface-border my-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-foreground/80 hover:text-accent transition-colors p-2 hover:bg-surface-border/50 rounded-full"
              >
                <ShoppingBag className="w-5 h-5" />
                {isMounted && itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-surface shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
