import fs from 'fs/promises'
import path from 'path'

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  
  try {
    await fs.access(uploadsDir)
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true })
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const extension = path.extname(file.name) || ''
  const filename = `${file.name.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '-')}-${uniqueSuffix}${extension}`
  
  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, buffer)

  return `/uploads/${filename}`
}
