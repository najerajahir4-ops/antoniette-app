'use client'

import React, { useState } from 'react'
import { toggleReviewVisibility } from '@/app/actions/admin'
import { Star, Eye, EyeOff, ShieldAlert } from 'lucide-react'

interface Review {
  id: string
  userId: string
  user: { email: string }
  rating: number
  comment: string
  hidden: boolean
  createdAt: string | Date
}

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [error, setError] = useState<string | null>(null)

  const handleToggleVisibility = async (id: string) => {
    setError(null)
    const res = await toggleReviewVisibility(id)
    if (res.error) {
      setError(res.error)
    } else {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderación de Reseñas</h1>
        <p className="text-foreground/60 text-sm mt-1">Oculta o muestra las opiniones de los clientes en la landing page.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-surface/20 border border-surface-border rounded-xl overflow-hidden shadow-xl">
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-foreground/40 font-light">
            Aún no hay reseñas registradas.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface/40 text-xs uppercase tracking-widest text-foreground/60">
                <th className="p-5 font-medium">Cliente</th>
                <th className="p-5 font-medium">Valoración</th>
                <th className="p-5 font-medium">Comentario</th>
                <th className="p-5 font-medium">Estado</th>
                <th className="p-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-surface/10 transition-colors">
                  <td className="p-5 text-sm font-light text-foreground/80">{review.user.email}</td>
                  <td className="p-5">
                    <div className="flex gap-0.5 text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-5 font-light text-sm max-w-md truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      review.hidden ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {review.hidden ? 'Oculta' : 'Visible'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleToggleVisibility(review.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                        review.hidden
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white'
                          : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      {review.hidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Mostrar
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Ocultar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
