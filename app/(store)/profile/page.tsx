import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Package, User as UserIcon } from 'lucide-react'
import { LogoutButton } from '@/components/ui/LogoutButton'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('ecommerce_session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  const payload = await verifyToken(sessionCookie)
  if (!payload || !payload.sub) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-500 bg-yellow-500/10',
    PAID: 'text-blue-500 bg-blue-500/10',
    SHIPPED: 'text-purple-500 bg-purple-500/10',
    DELIVERED: 'text-green-500 bg-green-500/10',
    CANCELLED: 'text-red-500 bg-red-500/10',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-foreground/60">{user.email}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <LogoutButton className="flex items-center text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors font-medium">
          <UserIcon className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </LogoutButton>
      </div>

      <div className="bg-surface border border-surface-border rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-surface-border flex items-center">
          <Package className="w-5 h-5 mr-2 text-foreground/80" />
          <h2 className="text-xl font-semibold text-foreground">Historial de Órdenes</h2>
        </div>
        
        {user.orders.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aún no has realizado ninguna compra.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {user.orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-surface-border/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-foreground/50 mb-1">
                      Orden #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'text-foreground bg-surface-border'}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-lg text-accent">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-background rounded-lg p-3 border border-surface-border">
                      <div className="flex items-center space-x-3">
                        <span className="text-foreground/50 font-medium">{item.quantity}x</span>
                        <span className="text-sm font-medium text-foreground">{item.product.name}</span>
                      </div>
                      <span className="text-sm text-foreground/70">${item.price.toFixed(2)} c/u</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
