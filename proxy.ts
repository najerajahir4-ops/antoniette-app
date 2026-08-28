import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

const protectedRoutes = ['/dashboard', '/admin', '/profile', '/mis-reservas', '/empleado']
const publicRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAdminRoute = path.startsWith('/admin')
  const isEmployeeRoute = path.startsWith('/empleado')
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  const sessionCookie = request.cookies.get('ecommerce_session')?.value
  const payload = sessionCookie ? await verifyToken(sessionCookie) : null

  // Redirigir a login si intenta entrar a ruta protegida sin sesión
  if (isProtectedRoute && !payload) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // Protección para Admin
  if (isAdminRoute && payload) {
    const role = payload.role as string
    if (role !== 'ADMIN') {
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'unauthorized_admin')
      return NextResponse.redirect(url)
    }
  }

  // Protección para Empleado
  if (isEmployeeRoute && payload) {
    const role = payload.role as string
    if (role !== 'EMPLEADO' && role !== 'ADMIN') {
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'unauthorized_employee')
      return NextResponse.redirect(url)
    }
  }

  // Si ya tiene sesión, evitar rutas públicas (login/register)
  if (isPublicRoute && payload) {
    const role = payload.role as string
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (role === 'EMPLEADO') {
      return NextResponse.redirect(new URL('/empleado', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
