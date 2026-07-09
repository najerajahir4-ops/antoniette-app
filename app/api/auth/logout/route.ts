import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('ecommerce_session')
  return NextResponse.redirect(new URL('/login', req.url))
}
