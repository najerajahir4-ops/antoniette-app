'use client'

import React, { useState } from 'react'
import { cancelReservation } from '@/app/actions/reservations'
import { Trash2 } from 'lucide-react'

export function CancelReservationButton({ reservationId, resDate, resTime }: { 
  reservationId: string
  resDate: string | Date
  resTime: string 
}) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verify if it's cancelable (> 2 hours)
  const isCancelable = () => {
    const resDateTime = new Date(resDate)
    const [hours, minutes] = resTime.split(':').map(Number)
    resDateTime.setHours(hours, minutes, 0, 0)
    
    const diffMs = resDateTime.getTime() - Date.now()
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours >= 2
  }

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return
    
    setIsPending(true)
    setError(null)
    
    const res = await cancelReservation(reservationId)
    setIsPending(false)
    
    if (res.error) {
      setError(res.error)
      alert(res.error) // Alert user on error
    }
  }

  if (!isCancelable()) {
    return (
      <span className="text-xs text-foreground/40 italic" title="Las reservas solo pueden ser canceladas con más de 2 horas de anticipación">
        No cancelable (límite alcanzado)
      </span>
    )
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-sm text-xs uppercase tracking-widest"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {isPending ? 'Cancelando...' : 'Cancelar'}
      </button>
      {error && <span className="text-[10px] text-red-400 mt-1">{error}</span>}
    </div>
  )
}
