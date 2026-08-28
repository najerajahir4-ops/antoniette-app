import React from 'react'
import { Users } from 'lucide-react'

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
      </div>
      
      <div className="bg-surface border border-surface-border rounded-xl p-12 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Próximamente</h2>
        <p className="text-foreground/60 max-w-md mx-auto">
          El módulo de gestión de clientes está en desarrollo. Pronto podrás ver y administrar los usuarios registrados desde aquí.
        </p>
      </div>
    </div>
  )
}
