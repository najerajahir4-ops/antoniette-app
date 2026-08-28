'use client'

import React, { useState } from 'react'
import { updateSettings } from '@/app/actions/settings'
import { Store, Clock, CalendarDays, Receipt, Save } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    storeName: initialSettings.storeName,
    storeAddress: initialSettings.storeAddress,
    storePhone: initialSettings.storePhone,
    openingTime: initialSettings.openingTime,
    closingTime: initialSettings.closingTime,
    reservationMaxAdvanceDays: initialSettings.reservationMaxAdvanceDays,
    taxPercentage: initialSettings.taxPercentage,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const res = await updateSettings(formData)
    
    if (res.success) {
      setMessage('Configuración guardada exitosamente.')
    } else {
      setMessage(res.error || 'Hubo un error al guardar.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-sm border ${message.includes('error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* Info General */}
      <div className="bg-surface border border-surface-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Store className="w-5 h-5 text-accent" /> Información del Restaurante
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Nombre del Restaurante</label>
            <input 
              type="text" 
              name="storeName" 
              value={formData.storeName} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Teléfono</label>
            <input 
              type="text" 
              name="storePhone" 
              value={formData.storePhone} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-foreground/60">Dirección</label>
            <input 
              type="text" 
              name="storeAddress" 
              value={formData.storeAddress} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-surface border border-surface-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" /> Horarios de Atención
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Hora de Apertura</label>
            <input 
              type="time" 
              name="openingTime" 
              value={formData.openingTime} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Hora de Cierre</label>
            <input 
              type="time" 
              name="closingTime" 
              value={formData.closingTime} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Reservas e Impuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-surface-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-accent" /> Reservas
          </h2>
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Anticipación Máxima (Días)</label>
            <input 
              type="number" 
              name="reservationMaxAdvanceDays" 
              min="1"
              max="365"
              value={formData.reservationMaxAdvanceDays} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
            <p className="text-xs text-foreground/40 mt-1">Cuántos días a futuro puede reservar un cliente.</p>
          </div>
        </div>

        <div className="bg-surface border border-surface-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-accent" /> Facturación
          </h2>
          <div className="space-y-2">
            <label className="text-sm text-foreground/60">Porcentaje de Impuestos (%)</label>
            <input 
              type="number" 
              name="taxPercentage" 
              min="0"
              max="100"
              step="0.1"
              value={formData.taxPercentage} 
              onChange={handleChange}
              className="w-full bg-background border border-surface-border rounded-sm px-4 py-2 text-foreground focus:border-accent outline-none"
              required
            />
            <p className="text-xs text-foreground/40 mt-1">Este porcentaje se sumará al total en la pantalla de pago (Ej. 15 = 15%).</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 bg-accent text-[#1A1D18] px-6 py-3 rounded-sm font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wider text-sm"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
