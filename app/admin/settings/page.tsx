import React from 'react'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
      </div>
      
      <div className="bg-surface border border-surface-border rounded-xl p-12 text-center">
        <Settings className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Próximamente</h2>
        <p className="text-foreground/60 max-w-md mx-auto">
          El módulo de configuración está en desarrollo. Pronto podrás ajustar las preferencias globales de la tienda desde aquí.
        </p>
      </div>
    </div>
  )
}
