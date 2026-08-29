import { NextRequest, NextResponse } from 'next/server';
import { uploadDishImage } from '@/lib/cloudinary';

// Forzar ejecución en entorno Node.js (necesario para streams y buffers de Cloudinary)
export const runtime = 'nodejs';

// Configuración de límites y tipos permitidos
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export async function POST(request: NextRequest) {
  try {
    // 0. Validar Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Petición inválida. El header Content-Type debe ser multipart/form-data.',
        },
        { status: 400 }
      );
    }

    // 1. Obtener los datos del formulario multipart/form-data
    const formData = await request.formData();
    
    // Permitir obtener el archivo bajo 'file' o 'image'
    const file = (formData.get('file') || formData.get('image')) as File | null;
    const customFolder = (formData.get('folder') as string) || 'menu_restaurante';

    // 2. Validación de presencia de archivo
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'No se ha adjuntado ningún archivo. Asegúrate de enviar el campo "file" o "image".',
        },
        { status: 400 }
      );
    }

    // 3. Validación de tipo MIME
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Formato de imagen no permitido ("${file.type}"). Solo se admiten JPG, JPEG, PNG, WebP y HEIC.`,
        },
        { status: 400 }
      );
    }

    // 4. Validación de tamaño de archivo (máx 10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `El archivo es demasiado pesado (${fileSizeMB} MB). El tamaño máximo permitido es de 10 MB.`,
        },
        { status: 400 }
      );
    }

    // 5. Convertir el archivo a Buffer para transmisión en stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Subir y transformar agresivamente con Cloudinary
    const uploadResult = await uploadDishImage(buffer, customFolder);

    // 7. Retornar respuesta exitosa estructurada
    return NextResponse.json(
      {
        success: true,
        message: 'Imagen subida y optimizada exitosamente.',
        data: {
          url: uploadResult.secure_url,
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          original_filename: file.name,
          original_size: file.size,
          // Cálculo de reducción de peso
          compression_ratio: `${Math.round((1 - uploadResult.bytes / file.size) * 100)}%`,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Upload API Error]:', error);

    // Detectar si el error proviene de credenciales inválidas o no configuradas
    const isCloudinaryConfigError =
      error.message?.includes('Must supply') ||
      error.message?.includes('Invalid') ||
      error.message?.includes('cloud_name');

    if (isCloudinaryConfigError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error de configuración en Cloudinary. Verifica las variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Ocurrió un error inesperado al procesar la imagen.',
      },
      { status: 500 }
    );
  }
}
