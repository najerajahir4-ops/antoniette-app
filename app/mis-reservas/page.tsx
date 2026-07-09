import React from 'react'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { getUserReservations } from '@/app/actions/reservations'
import { CancelReservationButton } from '@/components/store/CancelReservationButton'
import { Calendar, Clock, Users, UtensilsCrossed, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

async function getCurrentUser() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null
  return { id: payload.sub as string, email: payload.email as string, role: payload.role as string }
}

export default async function MisReservasPage() {
  const user = await getCurrentUser()
  const { reservations, error } = await getUserReservations()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-surface-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-widest text-accent uppercase">
            Antoniette
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors">
              Inicio
            </Link>
            <Link href="/reservar" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors">
              Reservar Mesa
            </Link>
            {user && user.role === 'ADMIN' && (
              <Link href="/admin" className="text-sm uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors">
                Admin
              </Link>
            )}
            {user && user.role === 'EMPLEADO' && (
              <Link href="/empleado" className="text-sm uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors">
                Empleado
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full space-y-8">
        <div>
          <h1 className="font-playfair text-4xl text-accent mb-2">Mis Reservas</h1>
          <p className="text-foreground/60 font-light">Historial y estado de tus reservaciones en Antoniette.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
            <ShieldAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!reservations || reservations.length === 0 ? (
          <div className="text-center py-20 bg-surface/10 border border-surface-border rounded-xl space-y-6 flex flex-col items-center">
            <div className="p-4 bg-accent/10 text-accent rounded-full border border-accent/20">
              <UtensilsCrossed className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium tracking-wide text-foreground/80">No tienes reservaciones activas</h3>
              <p className="text-foreground/50 font-light max-w-sm mx-auto">
                ¿Planeando una noche especial? Reserva tu mesa y disfruta de la mejor cocina italiana en las alturas.
              </p>
            </div>
            <Link 
              href="/reservar" 
              className="inline-flex px-8 py-3 bg-accent text-[#1A1D18] font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 rounded-sm text-sm"
            >
              Reservar Mesa
            </Link>
          </div>
        ) : (
          <div className="bg-surface/20 border border-surface-border rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-border bg-surface/40 text-xs uppercase tracking-widest text-foreground/60">
                    <th className="p-6 font-medium">Fecha</th>
                    <th className="p-6 font-medium">Hora</th>
                    <th className="p-6 font-medium">Mesa</th>
                    <th className="p-6 font-medium">Invitados</th>
                    <th className="p-6 font-medium">Estado</th>
                    <th className="p-6 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {reservations.map((res) => {
                    const resDate = new Date(res.date)
                    const formattedDate = resDate.toLocaleDateString('es-EC', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })

                    return (
                      <tr key={res.id} className="hover:bg-surface/10 transition-colors">
                        <td className="p-6 font-light">{formattedDate}</td>
                        <td className="p-6 font-mono text-sm">{res.time} hs</td>
                        <td className="p-6 font-medium text-accent">Mesa {res.table.number}</td>
                        <td className="p-6 font-light">{res.guests} personas</td>
                        <td className="p-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            res.status === 'CONFIRMADA' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            res.status === 'COMPLETADA' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          {res.status === 'CONFIRMADA' && (
                            <CancelReservationButton 
                              reservationId={res.id} 
                              resDate={res.date} 
                              resTime={res.time} 
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
