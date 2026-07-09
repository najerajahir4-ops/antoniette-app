'use client'

import React, { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { updateTableStatus, updateReservationStatus } from '@/app/actions/employee'
import { AlertCircle, Check, X, RefreshCw } from 'lucide-react'

interface Table {
  id: string
  number: number
  capacity: number
  status: string
}

interface Reservation {
  id: string
  userId: string
  user: { email: string }
  table: Table
  time: string
  guests: number
  status: string
}

export function EmployeeDashboard({
  initialTables,
  initialReservations,
}: {
  initialTables: Table[]
  initialReservations: Reservation[]
}) {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const tableStatuses = [
    { value: 'DISPONIBLE', label: 'Disponible', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { value: 'OCUPADA', label: 'Ocupada', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'RESERVADA', label: 'Reservada', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'LIMPIEZA', label: 'Limpieza', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'FUERA_DE_SERVICIO', label: 'Fuera de Servicio', color: 'text-foreground/40 bg-surface/50 border-surface-border' },
  ]

  const handleTableStatusChange = async (tableId: string, newStatus: string) => {
    setError(null)
    const res = await updateTableStatus(tableId, newStatus)
    if (res.error) {
      setError(res.error)
    } else if (res.table) {
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
      )
    }
  }

  const handleReservationStatusChange = async (reservationId: string, newStatus: string) => {
    setError(null)
    const res = await updateReservationStatus(reservationId, newStatus)
    if (res.error) {
      setError(res.error)
    } else {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: newStatus } : r))
      )
    }
  }

  return (
    <div className="space-y-10">
      {/* Header info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-3xl text-accent">Panel del Empleado</h1>
          <p className="text-foreground/60 text-sm font-light">Monitorea el salón y gestiona las reservas activas de hoy.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Salón de Mesas Grid */}
      <div className="space-y-4">
        <h2 className="text-xl uppercase tracking-wider text-accent font-semibold border-b border-surface-border pb-3">Estado del Salón (Mesas)</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {tables.map((table) => {
            const currentStatusObj = tableStatuses.find((s) => s.value === table.status)
            
            return (
              <motion.div
                key={table.id}
                className="bg-surface/30 border border-surface-border p-5 rounded-xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold">Mesa {table.number}</h3>
                    <p className="text-xs text-foreground/50">Cap. {table.capacity} pers.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Estado</label>
                  <select
                    value={table.status}
                    onChange={(e) => handleTableStatusChange(table.id, e.target.value)}
                    className="w-full bg-background border border-surface-border px-3 py-2 text-xs rounded-sm text-foreground focus:outline-none focus:border-accent"
                  >
                    {tableStatuses.map((s) => (
                      <option key={s.value} value={s.value} className="bg-surface">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Reservas de Hoy Table */}
      <div className="space-y-4">
        <h2 className="text-xl uppercase tracking-wider text-accent font-semibold border-b border-surface-border pb-3">Reservas para Hoy</h2>

        {reservations.length === 0 ? (
          <div className="text-center py-16 bg-surface/10 border border-surface-border rounded-xl text-foreground/40 font-light">
            No hay reservas agendadas para el día de hoy.
          </div>
        ) : (
          <div className="bg-surface/20 border border-surface-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-border bg-surface/40 text-xs uppercase tracking-widest text-foreground/60">
                    <th className="p-5 font-medium">Hora</th>
                    <th className="p-5 font-medium">Mesa</th>
                    <th className="p-5 font-medium">Cliente</th>
                    <th className="p-5 font-medium">Invitados</th>
                    <th className="p-5 font-medium">Estado</th>
                    <th className="p-5 font-medium text-right">Acciones de Servicio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {reservations.map((res) => {
                    const statusObj = tableStatuses.find((s) => s.value === res.status) || { label: res.status, color: 'text-foreground' }

                    return (
                      <tr key={res.id} className="hover:bg-surface/10 transition-colors">
                        <td className="p-5 font-mono text-sm font-semibold">{res.time} hs</td>
                        <td className="p-5 font-medium text-accent">Mesa {res.table.number}</td>
                        <td className="p-5 text-sm font-light text-foreground/80">{res.user.email}</td>
                        <td className="p-5 font-light">{res.guests} personas</td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            res.status === 'CONFIRMADA' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            res.status === 'COMPLETADA' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            res.status === 'PENDIENTE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          {res.status === 'CONFIRMADA' && (
                            <>
                              <button
                                onClick={() => handleReservationStatusChange(res.id, 'COMPLETADA')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-sm text-xs font-medium transition-colors"
                                title="Registrar Check-In / Completar"
                              >
                                <Check className="w-3.5 h-3.5" /> Completar
                              </button>
                              <button
                                onClick={() => handleReservationStatusChange(res.id, 'CANCELADA')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-sm text-xs font-medium transition-all"
                                title="Cancelar Reserva"
                              >
                                <X className="w-3.5 h-3.5" /> Cancelar
                              </button>
                            </>
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
      </div>
    </div>
  )
}
