'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { createReview } from '@/app/actions/reviews'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserSession {
  id: string
  email: string
  role: string
}

export function ReviewForm({ user }: { user: UserSession | null }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      router.push(`/login?redirect=/`)
      return
    }

    if (comment.trim().length === 0) {
      setError('Por favor, escribe un comentario.')
      return
    }

    setIsSubmitting(true)

    const res = await createReview(rating, comment)

    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setComment('')
      setRating(5)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 3000)
    }
  }

  return (
    <div className="bg-surface/30 border border-surface-border p-6 md:p-8 rounded-xl max-w-lg mx-auto">
      <h3 className="font-playfair text-2xl text-accent mb-2 text-center">Déjanos tu Reseña</h3>
      <p className="text-xs text-foreground/50 tracking-wide uppercase text-center mb-6">Comparte tu experiencia en Antoniette</p>

      {success ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 space-y-4 flex flex-col items-center"
        >
          <div className="p-3 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h4 className="text-lg font-medium text-foreground">¡Gracias por tu opinión!</h4>
          <p className="text-xs text-foreground/60 max-w-xs">
            Tu comentario ha sido registrado y ayudará a otros comensales a descubrir nuestra experiencia.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star selector */}
          <div className="flex flex-col items-center space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="text-accent focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoverRating ?? rating) ? 'fill-current text-accent' : 'opacity-20'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment text area */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Tu comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-background border border-surface-border px-4 py-3 text-foreground rounded-sm text-sm focus:outline-none focus:border-accent min-h-[100px] resize-none"
              placeholder="Cuéntanos qué te pareció la comida, la vista y el servicio..."
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            {!user ? (
              <button
                type="button"
                onClick={() => router.push('/login?redirect=/')}
                className="w-full py-3 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 font-bold uppercase tracking-wider text-xs rounded-sm"
              >
                Inicia Sesión para dejar Reseña
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-accent text-[#1A1D18] hover:scale-105 transition-transform duration-300 font-bold uppercase tracking-wider text-xs rounded-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
