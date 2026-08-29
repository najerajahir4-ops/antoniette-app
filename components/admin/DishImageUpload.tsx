'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';

interface DishImageUploadProps {
  initialImageUrl?: string;
  onUploadSuccess?: (secureUrl: string, publicId: string) => void;
  folder?: string;
}

export default function DishImageUpload({
  initialImageUrl = '',
  onUploadSuccess,
  folder = 'menu_restaurante',
}: DishImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{
    bytes: number;
    format: string;
    originalSize: number;
    compressionRatio: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    setErrorMsg(null);

    // Validación client-side de tamaño (10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg('La imagen supera el límite de 10 MB.');
      return;
    }

    // Previsualización instantánea en el navegador
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      // Construir FormData con el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Petición hacia el endpoint de subida
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al procesar la imagen.');
      }

      // Guardar metadata de optimización
      setUploadMeta({
        bytes: result.data.bytes,
        format: result.data.format,
        originalSize: result.data.original_size,
        compressionRatio: result.data.compression_ratio,
      });

      // Actualizar a la URL segura final de Cloudinary
      setPreviewUrl(result.data.secure_url);

      // Notificar al componente padre / formulario
      if (onUploadSuccess) {
        onUploadSuccess(result.data.secure_url, result.data.public_id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor.');
      // Revertir preview si falló
      if (!initialImageUrl) setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl('');
    setUploadMeta(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess('', '');
  };

  return (
    <div className="w-full space-y-4">
      {/* Contenedor Dropzone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center min-h-[240px] ${
          previewUrl
            ? 'border-accent/40 bg-surface/80'
            : 'border-surface-border hover:border-accent/60 bg-surface/40 hover:bg-surface/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        {/* Estado: Con imagen previsualizada */}
        {previewUrl ? (
          <div className="relative w-full h-56 flex items-center justify-center">
            <Image
              src={previewUrl}
              alt="Foto del plato"
              fill
              unoptimized={previewUrl.startsWith('blob:')}
              className="object-cover rounded-lg shadow-md"
            />

            {/* Overlay mientras sube */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 rounded-lg text-foreground">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-xs uppercase tracking-wider font-semibold">Optimizando y subiendo a Cloudinary...</p>
                <span className="text-[11px] text-foreground/70">Convirtiendo a WebP/AVIF · Redimensionando a 800px</span>
              </div>
            )}

            {/* Botón para cambiar / eliminar imagen */}
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600/80 text-white rounded-full transition-colors backdrop-blur-xs"
                title="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Estado vacío: Invitar a subir */
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
            <div className="p-4 rounded-full bg-accent/10 text-accent">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Arrastra la foto del plato aquí o <span className="text-accent underline">explora tus archivos</span>
              </p>
              <p className="text-xs text-foreground/50">
                JPG, PNG, WebP o HEIC · Máximo 10 MB
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-accent/80 font-light">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimización automática WebP/AVIF &lt;100 KB</span>
            </div>
          </div>
        )}
      </div>

      {/* Alerta de Error */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Badge de Éxito y Estadísticas de Compresión */}
      {uploadMeta && !isUploading && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">Imagen optimizada en la nube</span>
          </div>
          <div className="text-foreground/70 flex items-center gap-3">
            <span>
              Peso: <strong className="text-foreground font-mono">{(uploadMeta.bytes / 1024).toFixed(1)} KB</strong>
            </span>
            <span>·</span>
            <span>Formato: <strong className="text-foreground uppercase font-mono">{uploadMeta.format}</strong></span>
            <span>·</span>
            <span className="text-green-400 font-medium font-mono">-{uploadMeta.compressionRatio}</span>
          </div>
        </div>
      )}
    </div>
  );
}
