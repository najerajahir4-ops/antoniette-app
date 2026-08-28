'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProducto } from '@/app/actions/products'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export function DeleteButton({ id, productName }: { id: string, productName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteProducto(id)
    setIsDeleting(false)
    setIsOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Delete Producto"
        description={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
        isLoading={isDeleting}
      />
    </>
  )
}
