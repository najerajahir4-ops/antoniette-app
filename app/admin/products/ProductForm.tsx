'use client'

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormValues } from '@/lib/validations/product'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createProducto, updateProducto } from '@/app/actions/products'
import { Save, ArrowLeft, Upload, ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface Categoría {
  id: string
  name: string
}

interface ProductFormProps {
  initialData?: any
  categories: Categoría[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.images ? JSON.parse(initialData.images)[0] : null
  )

  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || '',
      isActive: initialData?.isActivo ?? true,
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  const onSubmit = (data: ProductFormValues) => {
    setError(null)
    const formData = new FormData()
    
    // Append JSON validated data
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    // Append File if selected
    const fileInput = document.getElementById('imageFile') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      formData.append('imageFile', fileInput.files[0])
    }

    startTransition(async () => {
      const res = isEditing 
        ? await updateProducto(initialData.id, formData)
        : await createProducto(formData)

      if (res.error) {
        setError(res.error)
      } else {
        router.push('/admin/products')
      }
    })
  }

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit as any)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products" className="p-2 text-foreground/60 hover:text-foreground hover:bg-surface-border rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            {isEditing ? 'Editar Productoo' : 'Nuevo Productoo'}
          </h1>
        </div>
        <Button type="submit" isLoading={isPending} className="px-6">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Guardar Cambios' : 'Crear Productoo'}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-surface-border p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-medium mb-4">Información Básica</h2>
            <div className="space-y-4">
              <Input
                label="Producto Name"
                placeholder="Premium T-Shirt"
                {...register('name')}
                error={errors.name?.message}
              />
              
              <Input
                label="Slug (URL amigable)"
                placeholder="premium-t-shirt"
                {...register('slug')}
                error={errors.slug?.message}
              />

              <div className="flex flex-col space-y-1.5 w-full text-left">
                <label className="text-sm font-medium text-foreground/90">Descripción</label>
                <textarea
                  {...register('description')}
                  className="w-full px-3 py-2 bg-surface/50 border border-surface-border rounded-lg text-foreground placeholder:text-foreground/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent min-h-[120px] transition-all"
                  placeholder="Describe el producto..."
                />
                {errors.description && (
                  <span className="text-xs text-red-500 font-medium">{errors.description.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-surface-border p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-medium mb-4">Precio e Inventario</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                step="0.01"
                label="Precio ($)"
                {...register('price')}
                error={errors.price?.message}
              />
              <Input
                type="number"
                label="Inventario Cantidad"
                {...register('stock')}
                error={errors.stock?.message}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl border border-surface-border p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-medium mb-4">Organización</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-foreground/90">Categoría</label>
                <select
                  {...register('categoryId')}
                  className="w-full px-3 py-2 bg-surface/50 border border-surface-border rounded-lg text-foreground backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="text-xs text-red-500 font-medium">{errors.categoryId.message}</span>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent/50 bg-surface/50"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground/90">
                  Activo (Visible in store)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl border border-surface-border p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-medium mb-4">Producto Image</h2>
            
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-xl border-2 border-dashed border-surface-border bg-surface/30 flex items-center justify-center overflow-hidden group hover:border-accent/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-foreground/50">Sin imagen</p>
                  </div>
                )}
                
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                  <div className="flex items-center text-white text-sm font-medium">
                    <Upload className="w-4 h-4 mr-2" />
                    {imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                  </div>
                  <input 
                    type="file" 
                    id="imageFile"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-foreground/50 text-center">
                Recomendado: 800x800px o mayor. JPEG, PNG o WebP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  )
}
