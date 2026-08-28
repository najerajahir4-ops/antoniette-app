'use client'

import { useState, useTransition } from 'react'
import { deleteCategory } from '@/app/actions/categories'
import { Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export function DeleteCategoryButton({ id, count }: { id: string, count: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCategory(id)
      setIsOpen(false)
    })
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-foreground/40 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Eliminar Categoría"
        description={
          count > 0 
            ? `No puedes eliminar esta categoría porque tiene ${count} producto(s) asociado(s). Cambia los productos de categoría primero.`
            : '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.'
        }
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
        isLoading={isPending}
      />
    </>
  )
}
