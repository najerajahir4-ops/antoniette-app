'use client'

import React, { useState, useEffect, startTransition } from 'react'
import { motion } from 'framer-motion'
import { getAvailableTables, createReservation } from '@/app/actions/reservations'
import { Calendar, Clock, Users, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserSession {
  id: string
  email: string
  role: string
}

interface Table {
  id: string
  number: number
  capacity: number
  status: string
  isAvailable: boolean
}

export function ReservationForm({ user }: { user: UserSession | null }) {
  const router = useRouter()
  
  // Set default date to today or tomorrow
  const getTodayStr = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [date, setDate] = useState(getTodayStr())
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', 
    '19:00', '19:30', '20:00', '20:30', 
    '21:00', '21:30', '22:00', '22:30'
  ]

  // Fetch tables whenever date or time changes
  useEffect(() => {
    async function fetchAvailability() {
      setIsLoading(true)
      setError(null)
      setSelectedTable(null) // Reset selection on slot change
      
      const res = await getAvailableTables(date, time)
      if (res.error) {
        setError(res.error)
      } else if (res.tables) {
        setTables(res.tables as Table[])
      }
      setIsLoading(false)
    }

    if (date && time) {
      fetchAvailability()
    }
  }, [date, time])

  const handleTableSelect = (table: Table) => {
    if (!table.isAvailable) return
    setSelectedTable(table)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      router.push(`/login?redirect=/reservar`)
      return
    }

    if (!selectedTable) {
      setError('Por favor, selecciona una mesa para tu reserva.')
      return
    }

    if (guests > selectedTable.capacity) {
      setError(`La mesa seleccionada solo tiene capacidad para ${selectedTable.capacity} personas.`)
      return
    }

    setIsSubmitting(true)

    const res = await createReservation({
      tableId: selectedTable.id,
      dateStr: date,
      timeStr: time,
      guests: guests
    })

    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/mis-reservas')
      }, 2000)
    }
  }

  return (
    <div className="bg-surface/30 backdrop-blur-xl border border-surface-border p-6 md:p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 space-y-6 flex flex-col items-center"
        >
          <div className="p-4 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
            <CheckCircle2 className="w-16 h-16 animate-bounce" />
          </div>
          <h3 className="font-playfair text-3xl text-accent">¡Reserva Confirmada!</h3>
          <p className="text-foreground/70 max-w-md mx-auto">
            Tu mesa ha sido reservada con éxito para el {date} a las {time} hs. Redirigiendo a tu historial...
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> Fecha
              </label>
              <input
                type="date"
                min={getTodayStr()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-surface-border px-4 py-3 text-foreground rounded-sm focus:outline-none focus:border-accent text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> Hora
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-background border border-surface-border px-4 py-3 text-foreground rounded-sm focus:outline-none focus:border-accent text-sm appearance-none"
                required
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} className="bg-surface">
                    {slot} hs
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" /> Personas
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-background border border-surface-border px-4 py-3 text-foreground rounded-sm focus:outline-none focus:border-accent text-sm"
                required
              />
            </div>
          </div>

          {/* Tables Grid Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-surface-border pb-4">
              <h3 className="text-lg uppercase tracking-wider text-accent font-medium">Selecciona tu Mesa</h3>
              <div className="flex gap-4 text-xs font-light tracking-wide">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-accent rounded-full"></span> Disponible
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-surface-border rounded-full"></span> Ocupada
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-foreground/50 uppercase tracking-widest">Buscando mesas disponibles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4">
                {tables.map((table) => {
                  const isSelected = selectedTable?.id === table.id
                  const isTooSmall = guests > table.capacity

                  return (
                    <motion.div
                      key={table.id}
                      whileHover={table.isAvailable ? { scale: 1.03 } : {}}
                      onClick={() => handleTableSelect(table)}
                      className={`relative flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/5' 
                          : table.isAvailable
                            ? 'border-accent/40 hover:border-accent bg-background/50' 
                            : 'border-surface-border bg-surface/10 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-2xl font-bold font-playfair text-foreground mb-1">Mesa {table.number}</span>
                      <span className="text-xs text-foreground/60">Cap. {table.capacity} personas</span>
                      
                      {table.isAvailable && isTooSmall && (
                        <div className="absolute top-1 right-1 text-amber-500" title="Mesa con capacidad insuficiente">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Form Actions / Feedback */}
          <div className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm"
              >
                {error}
              </motion.div>
            )}

            {selectedTable && guests > selectedTable.capacity && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-sm text-sm flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>El número de invitados ({guests}) supera la capacidad recomendada de la Mesa {selectedTable.number} (Capacidad: {selectedTable.capacity} personas).</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              {!user ? (
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-accent text-[#1A1D18] font-semibold tracking-widest uppercase hover:scale-105 transition-transform duration-300"
                >
                  Inicia Sesión para Reservar
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedTable || guests > selectedTable.capacity}
                  className="w-full md:w-auto px-10 py-4 bg-accent text-[#1A1D18] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300 rounded-sm"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
