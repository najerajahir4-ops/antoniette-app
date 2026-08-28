import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
})

export type ProductFormValues = z.infer<typeof productSchema>
