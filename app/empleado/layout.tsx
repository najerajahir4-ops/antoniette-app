import React from 'react'
import Link from 'next/link'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { redirect } from 'next/navigation'
import { ShieldCheck, Calendar, ClipboardList, LogOut, LayoutDashboard } from 'lucide-react'

async function checkAuth() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) redirect('/login?redirect=/empleado')
  
  const payload = await verifyToken(sessionToken)
  if (!payload || (payload.role !== 'EMPLEADO' && payload.role !== 'ADMIN')) {
    redirect('/?error=unauthorized_employee')
  }
  return payload
}

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  await checkAuth()

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-surface-border flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col space-y-1">
            <span className="font-playfair text-xl font-bold tracking-widest text-accent uppercase">
              Antoniette
            </span>
            <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-mono">
              Panel de Control
            </span>
          </div>

          {/* Nav links */}
          <nav className="space-y-2">
            <Link 
              href="/empleado"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 text-accent font-medium text-sm transition-all duration-300"
            >
              <LayoutDashboard className="w-4 h-4" />
              Vista General
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface/50 text-sm transition-all duration-300"
            >
              <ShieldCheck className="w-4 h-4" />
              Ver Sitio Público
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-4">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all duration-300 text-left"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative bg-[#131612]">
        {/* Glow effect */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
