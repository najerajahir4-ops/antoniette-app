'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Folder, LogOut, Grid, Star, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Órdenes', href: '/admin/orders', icon: Package },
  { name: 'Productos', href: '/admin/products', icon: Package },
  { name: 'Categorías', href: '/admin/categories', icon: Folder },
  { name: 'Clientes', href: '/admin/customers', icon: Users },
  { name: 'Mesas', href: '/admin/tables', icon: Grid },
  { name: 'Reseñas', href: '/admin/reviews', icon: Star },
  { name: 'Empleados', href: '/admin/employees', icon: ShieldAlert },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-surface-border bg-surface/40 backdrop-blur-lg flex-shrink-0 hidden md:flex flex-col h-full sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground">Admin<span className="text-accent">Panel</span></h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActivo = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivo 
                    ? 'bg-accent text-white shadow-md' 
                    : 'text-foreground/70 hover:bg-surface-border hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            A
          </div>
          <div className="text-sm font-medium">Administrator</div>
        </div>
        
        <form action="/api/auth/logout" method="POST" className="px-4">
          <motion.button 
            type="submit" 
            whileHover={{ x: 5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors w-full text-left py-2 px-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </motion.button>
        </form>
      </div>
    </aside>
  )
}
