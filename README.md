# Antoniette Rooftop & Cucina Italiana

> **Landing Page Oficial y Experiencia Gastronómica Digital**  
> Proyecto desarrollado con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4** y **Framer Motion**.

---

## 🌟 Descripción General

Plataforma digital interactiva y de alta gama creada para **Antoniette Rooftop & Cucina Italiana**, ubicado en Santo Domingo, Ecuador. 

El proyecto combina un diseño editorial de lujo, fotografía cinemática real y herramientas directas de conversión para conectar a los comensales con el restaurante a través de WhatsApp y geolocalización.

---

## ✨ Características y Cambios Recientes

### 1. 🟢 Botón Flotante de WhatsApp
* **Contacto Directo:** Enlace integrado a la línea oficial: `+593 99 897 1785`.
* **Mensaje Preconfigurado:** Mensaje de bienvenida listo para solicitar información y reservar mesa de inmediato.
* **Diseño Exclusivo (`components/WhatsAppButton.tsx`):**
  * Posición fija flotante en la esquina inferior derecha (`z-50`).
  * Gradiente esmeralda oficial con microinteracciones suaves al pasar el cursor (giro de icono y escala sutil).
  * Mensaje flotante (*tooltip*): *"¿En qué podemos ayudarte? Escríbenos"*.
  * Acabado estático limpio y elegante (sin parpadeos ni destellos distractores).
  * Integración global en `app/layout.tsx`.

### 2. 🧭 Barra de Navegación Centrada y Minimalista
* **Navegación Desktop Centrada:** Enlaces principales (*Nosotros · Menú · Experiencia · Ubicación*) centrados matemáticamente en el encabezado.
* **Simetría Editorial:**
  * **Izquierda:** Logo oficial transparente de Antoniette en alta resolución.
  * **Centro:** Enlaces de navegación con transiciones doradas al hover.
  * **Derecha:** Indicador luminoso de estado *"Abierto ahora"* con pulso verde sutil.
* **Eliminación de redundancia:** Se retiró el botón superior antiguo de "Reservar Mesa" para evitar duplicidad con el botón flotante de WhatsApp.

### 3. 📍 Sección de Ubicación y Mapa Interactivo
* **Dirección Clara:** Visualización limpia sin códigos técnicos:
  * **Dirección:** `Av. Río Yamboya y Caracas, Santo Domingo`
  * **Horario:** `Lunes a Sábado · 17h00 - 23h00`
  * **Reservas:** `099 897 1785`
* **Google Maps Integrado:**
  * Mapa a todo color (eliminado el filtro en blanco y negro / *grayscale*).
  * Marcador de ubicación oficial rojo (**📍**) fijado con exactitud sobre el restaurante.
  * Ficha comercial de Google con calificación de **4.6 estrellas (64 opiniones)** y botón directo para abrir GPS en el teléfono (*Abrir en Maps*).

### 4. 🍷 Portada Cinemática (Hero Section)
* **Fotografía Real 2.7K:** Foto auténtica del salón (`public/images/hero-antoniette-clean.jpg`).
* **Efecto Ken Burns Continuo:** Desplazamiento panorámico sutil de 22 segundos recorriendo el salón, la barra de coctelería y la terraza.
* **Tipografía Editorial:** Encabezados en *Playfair Display* y textos en *Inter*.
* **Paleta de Colores de Alta Cocina:**
  * Fondo Carbón: `#1A1D18`
  * Dorado Champán: `#C9A961` (hover `#B49653`)
  * Superficies y Bordes: `#232720` / `#3A4035`

### 5. 🍝 Menú Gastronómico Digital
* Extraído directamente de la carta oficial de 15 páginas (`public/menu-antoniette.pdf`).
* **5 Categorías Interactivas:**
  1. *Antipasti & Ensaladas* (Burrata Dolce Vita, Charcutería para 2, Calamari Fritti...)
  2. *Pastas & Focaccia*
  3. *Pizzas Artesanales*
  4. *Segundos & Risotto*
  5. *Coctelería & Vinos*
* Precios en dólares, descripciones detalladas de ingredientes y sellos distintivos (*"Recomendado"*, *"Para compartir"*, *"Premium"*).
* Botón de descarga directa para ver el **Menú Digital Completo (PDF)**.

### 6. ⚡ Optimización Multimedia (Cloudinary)
* Servicio de compresión y entrega rápida implementado en `lib/cloudinary.ts` y `app/api/upload/route.ts`.
* Componente de subida `components/admin/DishImageUpload.tsx` con reducción automática de más del 90% en peso de imágenes.

---

## 🛠️ Stack Tecnológico

| Herramienta | Versión / Detalle |
| :--- | :--- |
| **Framework** | Next.js 16.2.10 (App Router con Turbopack) |
| **Librería UI** | React 19.2.4 |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS 4 |
| **Animaciones** | Framer Motion 12 |
| **Iconos** | Lucide React |
| **Media CDN** | Cloudinary SDK v2 |

---

## 🚀 Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/najerajahir4-ops/antoniette-app.git
   cd antoniette-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de entorno:**  
   Crea un archivo `.env.local` basado en `.env.example`:
   ```env
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) o [http://localhost:3001](http://localhost:3001) en tu navegador.

5. **Construir para producción:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📂 Estructura del Proyecto

```text
antoniette-app/
├── app/
│   ├── api/
│   │   └── upload/route.ts          # Endpoint optimizado con Cloudinary
│   ├── globals.css                  # Variables de tema y barra de scroll dorada
│   ├── layout.tsx                   # Layout global con WhatsAppButton integrado
│   └── page.tsx                     # Landing page principal completa
├── components/
│   ├── WhatsAppButton.tsx           # Botón flotante animado de WhatsApp
│   └── admin/
│       └── DishImageUpload.tsx      # Subida drag & drop con Cloudinary
├── lib/
│   └── cloudinary.ts                # Configuración y transformaciones Cloudinary
├── public/
│   ├── images/                      # Fondos, logos y fotografías en alta definición
│   └── menu-antoniette.pdf          # Carta oficial completa del restaurante
├── .env.example                     # Plantilla de variables de entorno
├── package.json
└── README.md                        # Documentación técnica y bitácora
```

---

© 2026 Antoniette Rooftop & Cucina Italiana. Todos los derechos reservados.
