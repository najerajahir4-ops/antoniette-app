'use client'

import { useState, useTransition } from 'react'
import { createCategory } from '@/app/actions/categories'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function CategoryForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await createCategory(formData)
      if (res.error) setError(res.error)
      else (document.getElementById('cat-form') as HTMLFormElement).reset()
    })
  }

  return (
    <form id="cat-form" action={handleAction} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">{error}</div>}
      
      <div>
        <Input name="name" label="Nombre" required placeholder="Ej. Electrónica" />
      </div>
      <div>
        <Input name="slug" label="Slug" required placeholder="ej-electronica" />
      </div>
      <div>
        <Input name="description" label="Descripción" placeholder="Breve descripción (opcional)" />
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Guardar Categoría
      </Button>
    </form>
  )
}
