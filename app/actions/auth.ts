'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { createSessionCookie, deleteSessionCookie, getSessionCookie } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'User already exists' }
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    }
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
    return { error: 'Email and password are required' }
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !user.isActive) {
    return { error: 'Invalid credentials or inactive account' }
  }

  const isValid = await comparePassword(password, user.passwordHash)

  if (!isValid) {
    return { error: 'Invalid credentials' }
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
  return { id: payload.sub as string, email: payload.email as string, role: payload.role as string }
}
