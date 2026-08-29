import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Validar que las variables de entorno estén presentes
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    '[Cloudinary Warning]: Faltan variables de entorno (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). ' +
    'Asegúrate de configurarlas en tu archivo .env.local'
  );
}

// Configuración del SDK oficial
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Sube una imagen a Cloudinary desde un buffer con optimización agresiva obligatoria.
 * - Redimensiona a máximo 800px de ancho (crop: 'limit' mantiene la proporción sin deformar ni agrandar imágenes menores).
 * - Calidad automática inteligente (quality: 'auto').
 * - Conversión automática a formatos modernos ligeros WebP o AVIF (fetch_format: 'auto').
 */
export async function uploadDishImage(
  fileBuffer: Buffer,
  folder: string = 'menu_restaurante'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        // Transformaciones automáticas en la subida
        transformation: [
          {
            width: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(
            new Error(
              `Error al subir la imagen a Cloudinary: ${error?.message || 'Resultado indefinido'}`
            )
          );
        }

        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Utilidad opcional para construir URLs dinámicas con transformaciones sobre la marcha.
 */
export function buildOptimizedImageUrl(
  publicId: string,
  options?: { width?: number; height?: number; quality?: string | number }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: 'auto',
    quality: options?.quality || 'auto',
    width: options?.width || 800,
    crop: 'limit',
  });
}

export default cloudinary;
