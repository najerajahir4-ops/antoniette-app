import { prisma } from '@/lib/prisma'
import { Package } from 'lucide-react'
import { StatusSelect } from './StatusSelect'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const resolvedParams = await searchParams
  const filterStatus = resolvedParams.status

  const orders = await prisma.order.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  const statusMap: Record<string, string> = {
    'ALL': 'Todos',
    'PENDING': 'Pendiente',
    'PAID': 'Pagado',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Órdenes</h1>
          <p className="text-foreground/60 mt-2">Gestiona los pedidos y su estado de envío.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
            <a
              key={s}
              href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                (filterStatus === s) || (!filterStatus && s === 'ALL')
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-foreground/70 border-surface-border hover:bg-surface-border'
              }`}
            >
              {statusMap[s]}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-surface-border/20 border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID de Orden</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No hay órdenes registradas.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground/70">
                      {order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {order.user?.email || 'Invitado'}
                      </div>
                      <div className="text-xs text-foreground/50">
                        {order.items.length} artículos
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-accent">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
