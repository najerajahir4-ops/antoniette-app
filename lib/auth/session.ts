import { cookies } from 'next/headers'
import { signToken } from './jwt'

const SESSION_COOKIE_NAME = 'ecommerce_session'

export async function createSessionCookie(payload: { sub: string; email: string; role: string; jti: string }) {
  const token = await signToken(payload)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expires,
    path: '/',
  })
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSessionCookie() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)
  return cookie?.value
}
