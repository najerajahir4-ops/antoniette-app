import { Navbar } from '@/components/ui/Navbar'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('ecommerce_session')?.value
  let user = null
  
  if (sessionCookie) {
    const payload = await verifyToken(sessionCookie)
    if (payload) {
      user = { id: payload.sub as string, role: payload.role as string }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
