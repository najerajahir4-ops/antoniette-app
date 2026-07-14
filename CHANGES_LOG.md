# Registro de Cambios y Correcciones (CHANGES_LOG)

## FASE 1: SEGURIDAD - Protección de `.env`
- **Archivos modificados:** `.gitignore`, `.env.example` (creado).
- **Acciones:**
  - Se verificó y actualizó `.gitignore` para asegurar la inclusión estricta de `.env`, `.env.local`, `.env.production` y `.env*.local`.
  - Se verificó mediante `git ls-files` que el archivo `.env` **no estaba siendo trackeado** por git desde el inicio (el comando no arrojó resultados), por lo que estaba a salvo y no fue necesario eliminarlo de la caché.
  - Se creó el archivo `.env.example` con las claves base (DATABASE_URL, JWT_SECRET, RESEND_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) más las nuevas requeridas por Cloudinary.

## FASE 2: MIGRACIÓN DE STORAGE A CLOUDINARY
- **Archivos modificados:** `lib/storage/index.ts`, `package.json` (instalación de SDK), `.env.example`.
- **Acciones:**
  - Se instaló la librería `cloudinary` vía npm.
  - Se reescribió `lib/storage/index.ts` usando `cloudinary.uploader.upload_stream` para subir el archivo en formato Buffer.
  - La función sigue retornando un `Promise<string>` con la URL segura (`secure_url`), por lo que los Server Actions (`app/actions/products.ts`) no necesitaron cambios en sus llamadas y seguirán funcionando transparentemente.
- **Variables de entorno nuevas que NECESITAS configurar en Vercel:**
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## FASE 3: LIMPIEZA DE CÓDIGO MUERTO - PAGOS
- **Decisión pendiente sobre Payphone:** 
  Se encontraron los siguientes archivos relacionados a la integración de Payphone:
  - `app/api/checkout/payphone-backup.ts` (Script suelto/respaldo de checkout).
  - `app/api/webhooks/payphone/route.ts` (Webhook para confirmar el estado de la transacción).
  *Estado:* Parece una integración manual bastante avanzada pero abandonada a favor de Stripe. Se requiere tu decisión para **mantener, terminar de integrar, o eliminar por completo**.

- **Alerta Crítica en Stripe (Resuelta):**
  - **Falso positivo de pago (Corregido):** Se modificó `app/api/checkout/route.ts` para eliminar el fallback falso. Ahora, si `STRIPE_SECRET_KEY` falta, el sistema registra un error en consola y retorna un error HTTP 500, bloqueando cualquier redirección a éxito.
  - **Webhook de Stripe (Creado):** Se implementó `app/api/webhooks/stripe/route.ts`. Este endpoint seguro recibe el evento raw, verifica la firma criptográfica con `STRIPE_WEBHOOK_SECRET` y escucha exclusivamente `checkout.session.completed` para actualizar el status de la orden a `PAID` en la base de datos de manera inviolable desde el servidor.

## FASE 4: OTRAS MEJORAS DE SEGURIDAD Y LÓGICA (Implementadas previamente)
- **Seguridad en Soft-Deletes:** 
  - Se modificaron `app/actions/auth.ts` y `app/actions/admin.ts` para que ya no confíen ciegamente en el JWT de la sesión. 
  - Ahora, cada vez que validan una sesión, consultan la base de datos para asegurar que el usuario tenga `isActive: true`.
  - Se forzó el cierre de sesión inmediato (eliminando las sesiones en base de datos) al desactivar a un usuario en el panel de administrador.
- **Lógica de Reservas (Prevención de Solapamiento):** 
  - Se implementó un "bloqueo" de la mesa por un margen de 2 horas (120 minutos) en `app/actions/reservations.ts`.
  - El sistema ahora filtra inteligentemente la disponibilidad, rechazando reservas que chocan dentro de un margen de +/- 120 minutos con una reserva activa.
- **Entorno Local:** Se agregaron exitosamente las credenciales de Cloudinary al archivo `.env` de tu computadora para permitir subir imágenes en el servidor de desarrollo local.
