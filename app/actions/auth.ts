'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { createSessionCookie, deleteSessionCookie, getSessionCookie } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { sendVerificationEmail } from '@/lib/email/send'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'El correo electrónico y la contraseña son obligatorios' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'El usuario ya existe con este correo electrónico' }
  }

  const passwordHash = await hashPassword(password)
  const verificationToken = crypto.randomUUID()
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
      lastVerificationSentAt: new Date(),
    }
  })

  // Enviar el correo de verificación de forma asíncrona sin bloquear la respuesta del registro
  sendVerificationEmail(email, verificationToken).catch((err) => {
    console.error('Error asíncrono enviando email de verificación:', err)
  })

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionToken = crypto.randomUUID()
  
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires
    }
  })

  await createSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role,
    jti: sessionToken,
  })

  if (user.role === 'ADMIN' || user.role === 'MANAGER') {
    redirect('/admin')
  } else {
    redirect('/')
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'El correo electrónico y la contraseña son obligatorios' }
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return { error: 'Credenciales incorrectas' }
  }

  if (!user.isActive) {
    return { error: 'Esta cuenta ha sido desactivada' }
  }

  if (!user.emailVerified) {
    return { 
      error: 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo enlace.',
      code: 'EMAIL_UNVERIFIED',
      email: user.email
    }
  }

  const isValid = await comparePassword(password, user.passwordHash)

  if (!isValid) {
    return { error: 'Credenciales incorrectas' }
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionToken = crypto.randomUUID()

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires
    }
  })

  await createSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role,
    jti: sessionToken,
  })

  if (user.role === 'ADMIN' || user.role === 'MANAGER') {
    redirect('/admin')
  } else {
    redirect('/')
  }
}

export async function logoutUser() {
  await deleteSessionCookie()
  redirect('/login')
}

import { verifyToken } from '@/lib/auth/jwt'
export async function getCurrentUserAction() {
  const sessionToken = await getSessionCookie()
  if (!sessionToken) return null
  const payload = await verifyToken(sessionToken)
  if (!payload) return null
  
  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    select: { id: true, email: true, role: true, emailVerified: true, isActive: true }
  })
  
  if (!user || !user.isActive) return null
  
  return user
}
