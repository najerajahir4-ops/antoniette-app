import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import { DeleteButton } from './DeleteButton'

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const pageSize = 10
  
  const totalProductos = await prisma.product.count()
  const totalPages = Math.ceil(totalProductos / pageSize)

  const products = await prisma.product.findMany({
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Productos</h1>
          <p className="text-sm text-foreground/60 mt-1">Gestiona el inventario y precios de tu tienda.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Productoo
        </Link>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-surface-border rounded-xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/80">
            <thead className="bg-surface-border/30 text-foreground/60 font-medium">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Inventario</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                    No products found. Start by adding one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-border/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-xs text-foreground/50 mt-1">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.stock} en stock
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.category?.name || 'Sin categoría'}</td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">Activo</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-foreground/10 text-foreground/60">Borrador</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-foreground/60 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton id={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border/50 bg-surface-border/10">
            <div className="text-sm text-foreground/60">
              Mostrando página {currentPage} de {totalPages}
            </div>
            <div className="flex space-x-2">
              <Link 
                href={`/admin/products?page=${currentPage - 1}`}
                className={`px-3 py-1 rounded-md text-sm ${currentPage <= 1 ? 'pointer-events-none opacity-50 bg-surface-border/50' : 'bg-surface hover:bg-surface-border transition-colors'}`}
              >
                Anterior
              </Link>
              <Link 
                href={`/admin/products?page=${currentPage + 1}`}
                className={`px-3 py-1 rounded-md text-sm ${currentPage >= totalPages ? 'pointer-events-none opacity-50 bg-surface-border/50' : 'bg-surface hover:bg-surface-border transition-colors'}`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
