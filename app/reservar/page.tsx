import React from 'react'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { ReservationForm } from '@/components/store/ReservationForm'
import Link from 'next/link'

async function getCurrentUser() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null
  return { id: payload.sub as string, email: payload.email as string, role: payload.role as string }
}

export default async function ReservarPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Mini-Header for navigation */}
      <header className="border-b border-surface-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-widest text-accent uppercase">
            Antoniette
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors">
              Inicio
            </Link>
            {user ? (
              <>
                <Link href="/mis-reservas" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors">
                  Mis Reservas
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-sm uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors">
                    Admin
                  </Link>
                )}
                {user.role === 'EMPLEADO' && (
                  <Link href="/empleado" className="text-sm uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors">
                    Empleado
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login?redirect=/reservar" className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-background transition-colors duration-300 rounded-sm text-sm uppercase tracking-widest">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-playfair text-4xl md:text-5xl text-accent">Reserva tu Mesa</h1>
          <p className="text-foreground/60 max-w-xl mx-auto font-light leading-relaxed">
            Selecciona una fecha, hora e invitados para ver la disponibilidad de nuestras 10 mesas exclusivas en tiempo real.
          </p>
        </div>

        <ReservationForm user={user} />
      </main>
    </div>
  )
}
