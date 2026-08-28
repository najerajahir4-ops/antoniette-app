'use client'

import React, { useState } from 'react'
import { Loader2, Mail, ShieldAlert } from 'lucide-react'

export function ReenviarBoton({ email: initialEmail }: { email?: string }) {
  const [email, setEmail] = useState(initialEmail || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReenviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/reenviar-verificacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al reenviar el correo')
      } else {
        setMessage('Correo de verificación reenviado con éxito. Revisa tu bandeja de entrada.')
      }
    } catch (err) {
      setError('Error de conexión al intentar reenviar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleReenviar} className="space-y-4">
      {!initialEmail && (
        <div className="text-left">
          <label className="text-xs uppercase tracking-widest text-[#C9A961] block mb-2 font-medium">
            Ingresa tu Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/60 border border-[#C9A961]/30 rounded-sm py-2 px-4 text-sm text-foreground focus:outline-none focus:border-[#C9A961] transition-colors"
            placeholder="ejemplo@correo.com"
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm flex gap-2 items-center text-left">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-sm flex gap-2 items-center text-left">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full py-3 px-6 bg-transparent border border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1D18] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#C9A961] transition-all duration-300 font-semibold tracking-widest text-xs uppercase flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Reenviar Correo de Verificación'
        )}
      </button>
    </form>
  )
}
