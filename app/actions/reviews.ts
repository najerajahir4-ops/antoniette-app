'use server'

import { prisma } from '@/lib/prisma'
import { getSessionCookie } from '@/lib/auth/session'
import { verifyToken } from '@/lib/auth/jwt'
import { revalidatePath } from 'next/cache'

async function getAuthUser() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null
  return { id: payload.sub as string, email: payload.email as string }
}

export async function createReview(rating: number, comment: string) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return { error: 'Debes iniciar sesión para dejar una reseña', code: 'UNAUTHORIZED' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerified: true }
    })

    if (!dbUser || !dbUser.emailVerified) {
      return { error: 'Verifica tu correo electrónico para poder dejar una reseña', code: 'EMAIL_UNVERIFIED' }
    }

    if (!rating || rating < 1 || rating > 5) {
      return { error: 'La calificación debe estar entre 1 y 5 estrellas' }
    }

    if (!comment || comment.trim().length === 0) {
      return { error: 'El comentario no puede estar vacío' }
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        rating,
        comment: comment.trim(),
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/reviews')
    return { success: true, review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { error: 'Error al enviar la reseña' }
  }
}

export async function getActiveReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        hidden: false,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Show latest 6 reviews
    })

    // Map user email to name prefix for aesthetic purposes
    return {
      reviews: reviews.map((r) => ({
        id: r.id,
        name: r.user.email.split('@')[0],
        text: r.comment,
        rating: r.rating,
      })),
    }
  } catch (error) {
    console.error('Error getting reviews:', error)
    return { error: 'Error al cargar testimonios' }
  }
}
