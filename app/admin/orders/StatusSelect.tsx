'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus } from '@/app/actions/orders'

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
    })
  }

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    PAID: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    SHIPPED: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    DELIVERED: 'text-green-500 bg-green-500/10 border-green-500/20',
    CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
  }

  // Admin should only transition from PAID -> SHIPPED -> DELIVERED, or to CANCELLED.
  // They shouldn't be able to manually set PENDING or PAID.
  const allowedOptions = Object.keys(STATUS_MAP).map(s => ({
    value: s,
    label: STATUS_MAP[s],
    disabled: (s === 'PENDING' || s === 'PAID') && s !== currentStatus
  }))

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${statusColors[status]} disabled:opacity-50`}
    >
      {allowedOptions.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-surface text-foreground">
          {opt.label}
        </option>
      ))}
    </select>
  )
}
