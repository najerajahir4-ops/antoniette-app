# Auditoría Técnica del Proyecto: Antoniette Rooftop (ecommerce-app)

## 1. Resumen general
**ecommerce-app** es una aplicación web full-stack para un restaurante / e-commerce italiano ("Antoniette Rooftop & Cucina Italiana"). Combina un sistema de tienda en línea (catálogo, carrito, checkout) con un sistema de reservas de mesas para el restaurante físico. También incluye paneles de administración y de empleados para gestionar órdenes, productos, mesas y usuarios.

**Stack tecnológico principal:**
- **Framework Core:** Next.js 16.2.10 (App Router)
- **Frontend:** React 19.2.4, TailwindCSS 4, Framer Motion (animaciones), Zustand (manejo de estado global del carrito)
- **Backend & Base de Datos:** Prisma ORM 5.22.0, PostgreSQL (alojado en NeonDB)
- **Autenticación:** Implementación custom con JWT (`jose`), encriptación de contraseñas (`bcryptjs`) y control de sesiones.
- **Integraciones de terceros:** 
  - **Pagos:** Stripe 22.3.0
  - **Emails/Notificaciones:** Resend 6.17.2

## 2. Estructura del proyecto
La estructura sigue las convenciones de Next.js (App Router):

- `/app`: Contiene las rutas, páginas y endpoints de la aplicación.
  - `/(auth)`: Rutas de inicio de sesión, registro, etc.
  - `/(store)`: Vistas de cliente (catálogo, productos).
  - `/actions`: Server Actions de Next.js que actúan como la capa de controladores (para admin, auth, orders, products, reservas).
  - `/admin`: Panel de control de administradores.
  - `/api`: Endpoints REST, incluyendo webhooks (Stripe/Payphone) y checkout.
  - `/empleado`: Panel de control de empleados.
- `/components`: Componentes de interfaz (UI), divididos lógicamente en `/admin`, `/cart`, `/employee`, `/store`, `/ui` (seguramente usando shadcn/ui o componentes genéricos).
- `/lib`: Lógica de negocio base.
  - `/auth`: Utilidades de JWT, contraseñas y sesiones.
  - `/email`: Configuración de Resend y plantillas.
  - `/storage`: Utilidad de subida de archivos (filesystem local).
  - `prisma.ts`: Instancia del cliente Prisma.
- `/prisma`: Definición del modelo de datos (`schema.prisma`) y scripts de semilla (seed).
- `/public`: Activos estáticos, imágenes, fuentes.
- `/scripts`: Scripts de utilidad (ej. migraciones, fix de ts, traducción).

## 3. Modelo de datos
El modelo de datos relacional se gestiona mediante Prisma. Sus entidades y relaciones principales son:

- **User**: Usuarios del sistema. Contiene campos de autenticación (email, passwordHash), rol y estado (isActive). Se relaciona con *Orders*, *Sessions*, *Reservations* y *Reviews*.
- **Session**: Manejo de sesiones activas (relación con User).
- **Product & Category**: Catálogo de la tienda. Un producto pertenece a una categoría.
- **Order & OrderItem**: Gestión de compras. Una Orden tiene un estado ("PENDING", "PAID", etc.) y pertenece a un User. Contiene múltiples OrderItems (relacionados al Product).
- **Table**: Mesas del restaurante físico (número, capacidad, estado actual).
- **Reservation**: Reservas de mesas. Relaciona a un *User* con una *Table* en una fecha/hora específica.
- **Review**: Sistema de reseñas de clientes hacia la tienda o platillos.

## 4. Autenticación y roles
El sistema de autenticación no usa NextAuth/Auth.js. En su lugar, usa un sistema JWT (JSON Web Tokens) creado a medida.

**Funcionamiento de Auth:**
- Login/Registro generan un hash de contraseña con `bcryptjs`.
- Se usa la librería `jose` para generar un JWT, guardándolo como una sesión en la BD (modelo `Session`) y también se manejan cookies HTTP-Only.
- Se integra **Resend** para validación y verificación de correos electrónicos.

**Roles existentes:**
1. **ADMIN**: Tiene acceso total. Puede gestionar usuarios, productos, mesas, revisar métricas y reportes globales, y aplicar moderación (ej. ocultar reseñas o hacer "soft delete" a usuarios).
2. **EMPLEADO**: Tiene permisos intermedios. Puede ver/gestionar órdenes y el estado de las reservas/mesas en su propio panel (`/empleado`), pero no puede cambiar configuración global ni gestionar usuarios.
3. **CLIENTE (Rol por defecto)**: Puede navegar por la tienda, gestionar su carrito, hacer reservas de mesas, dejar reseñas y completar pagos.

## 5. Rutas/Endpoints API y Server Actions
Gran parte de las mutaciones se manejan con Server Actions (en `/app/actions`), pero existen endpoints dedicados para casos específicos:

- `/api/checkout`: Inicia el flujo de pagos. Crea una Checkout Session de Stripe y retorna la URL para redirigir al usuario.
- `/api/webhooks/stripe`: Endpoint seguro que recibe eventos de Stripe (ej. `checkout.session.completed`) para marcar las órdenes como pagadas en la BD.
- `/api/webhooks/payphone`: Webhook tentativo para pagos con Payphone (pasarela ecuatoriana).

Server Actions clave (ejecutan la lógica CRUD):
- `admin.ts` / `employee.ts`: CRUD de mesas, actualización de roles de usuario, control de visibilidad de reviews, obtención de KPIs.
- `reservations.ts`: Creación y control de conflictos de reservas.
- `products.ts` / `categories.ts`: Gestión del catálogo.

## 6. Estado de features

| Feature | Estado | Notas |
| :--- | :--- | :--- |
| **Catálogo y Productos** | Completo | Lectura, escritura, asignación a categorías listas. |
| **Carrito de Compras** | Completo | Implementado localmente usando `Zustand`. |
| **Autenticación (Custom)** | Completo | Flujo completo, incluye envío de tokens de verificación por mail. |
| **Panel de Administrador** | Completo | Acceso CRUD a entidades y reportes (métricas básicas implementadas). |
| **Reservas de Mesas** | Completo | Validación de disponibilidad, asignación a clientes y control de estado de la mesa. |
| **Pagos (Stripe)** | Completo / Parcial | Funciona la creación de sesión y webhook, pero el código tiene fallbacks si no encuentra keys. |
| **Pagos (Payphone)** | Parcial | Hay archivos como `payphone-backup.ts` y webhook. Parece experimental o incompleto. |
| **Reseñas (Reviews)** | Completo | Los usuarios dejan reviews y el ADMIN puede marcarlas como "hidden". |
| **Imágenes (Cloudinary)** | Pendiente | **NO se usa Cloudinary**. La subida (en `lib/storage/index.ts`) escribe directo a la carpeta local `/public/uploads`. |

## 7. Problemas o deudas técnicas detectadas

1. **Subida de Archivos Local (Riesgo en Deploy):** Actualmente el proyecto usa el módulo `fs/promises` para guardar imágenes de productos localmente en `public/uploads`. Esto **romperá** al desplegar en plataformas Serverless/Efímeras como Vercel o Heroku, ya que los archivos subidos desaparecerán. Se requiere urgentemente la migración a AWS S3 o Cloudinary.
2. **Código muerto/Legacy de pagos:** Existe `app/api/checkout/payphone-backup.ts`. Esto añade ruido. Se debe decidir si usar Stripe, Payphone o ambos, y limpiar el código de respaldo.
3. **Manejo de Secretos en Repositorio:** El archivo `.env` actual expone una URL de base de datos PostgreSQL productiva/de Neon. No debe comitearse.
4. **Validación Exhaustiva:** Al no usar una librería estándar como Auth.js (NextAuth), la seguridad manual (verificación de cookies y tokens en cada action) es frágil si se olvida implementar en algún endpoint futuro.
5. **Soft Deletes en Usuarios vs Cascadas:** Al eliminar un usuario en Admin (`admin.ts: deleteUser`), se usa un Soft Delete (`isActive: false`). Sin embargo, en el modelo `Session`, el `onDelete: Cascade` borrará las sesiones activas, pero el usuario inactivo mantendrá sus órdenes y reservas huérfanas en la interfaz si las queries no filtran usuarios inactivos correctamente.

## 8. Configuración de entorno
El proyecto requiere las siguientes variables de entorno para funcionar en su totalidad (nombres de keys):

- `DATABASE_URL`: String de conexión de PostgreSQL (Prisma).
- `JWT_SECRET`: Clave secreta para firmar los tokens de sesión.
- `RESEND_API_KEY`: Llave de la API de Resend para envío de correos.
- `STRIPE_SECRET_KEY`: Llave secreta de Stripe para cobros y generación de sesiones de checkout.
- `STRIPE_WEBHOOK_SECRET` *(Asumida/Requerida)*: Necesaria para validar firmas en el webhook de pagos.

## 9. Despliegue y Hosting
El proyecto está preparado para su despliegue (o se encuentra actualmente alojado) en **Vercel** (`*.vercel.app`). 

Es importante tener en cuenta el comportamiento de la arquitectura bajo este entorno:
- **Frontend y API Routes:** Funcionan sin problemas al aprovechar el entorno Serverless de Next.js.
- **Base de Datos (PostgreSQL):** Al usar NeonDB, Vercel se conecta externamente sin dificultades, logrando persistencia total en datos de usuarios, reservas, órdenes y productos.
- **Limitación en el almacenamiento (Advertencia):** Las imágenes subidas por los administradores se guardan con `fs/promises` y desaparecerán periódicamente. Aunque en las pruebas iniciales después de subir un archivo pareciera funcionar (porque la función lambda local no se ha destruido), estas imágenes no persistirán en el tiempo. Se debe integrar Cloudinary o Vercel Blob.
