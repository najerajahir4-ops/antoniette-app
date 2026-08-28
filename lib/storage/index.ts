// NOTA: Requiere configurar CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en Vercel
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce' },
        (error, result) => {
          if (error || !result) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error || new Error('Upload failed'));
            return;
          }
          resolve(result.secure_url);
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw new Error('No se pudo subir la imagen');
  }
}
