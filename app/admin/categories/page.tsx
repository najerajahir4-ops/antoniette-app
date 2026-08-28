import { prisma } from '@/lib/prisma'
import { Folder } from 'lucide-react'
import { CategoryForm } from './CategoryForm'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categorías</h1>
          <p className="text-foreground/60 mt-2">Agrupa tus productos en colecciones.</p>
        </div>

        <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-surface-border/20 border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium text-center">Productos</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-border/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-foreground/70">{cat.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-surface-border/50 text-foreground px-2 py-1 rounded-md text-xs font-bold">
                        {cat._count.products}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteCategoryButton id={cat.id} count={cat._count.products} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="bg-surface border border-surface-border rounded-xl p-6 sticky top-24 shadow-xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <Folder className="w-5 h-5 mr-2" /> Nueva Categoría
          </h2>
          <CategoryForm />
        </div>
      </div>
    </div>
  )
}
