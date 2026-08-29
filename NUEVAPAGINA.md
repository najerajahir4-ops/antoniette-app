# Estado General del Proyecto: Antoniette App

> **Fecha de actualización:** 28 de Agosto, 2026  
> **Estado:** 100% Funcional y probado localmente en `http://localhost:3000`  
> **Directiva importante:** Mantener desarrollo 100% local (NO desplegar a Vercel ni hacer `git push` por ahora).

---

## 1. Resumen de la Aplicación

La aplicación es la **Landing Page Oficial y Sistema Gastronómico Digital** de **Antoniette Rooftop & Cucina Italiana** (ubicado en Santo Domingo, Ecuador). 

El proyecto fue completamente saneado y modernizado, eliminando todo el código antiguo de ecommerce y reservas para dejar una base de código ultraligera, elegante y de nivel premium.

### Stack Tecnológico
* **Framework:** Next.js 16 (App Router) con Turbopack
* **Frontend:** React 19, TypeScript, Tailwind CSS 4, Framer Motion
* **Iconografía:** Lucide React
* **Tipografías:** Playfair Display (editorial italiano) e Inter
* **Multimedia & CDN:** Cloudinary SDK v2 oficial con optimización agresiva

---

## 2. Lo que está Construido y Funcionando

### A. Portada Cinemática (Hero Section)
* **Fotografía real en alta resolución (2.7K):** Se utiliza `public/images/hero-antoniette-clean.jpg`.
* **Pared limpia sin choques:** Se limpiaron las letras físicas de la pared verde esmeralda de la imagen de fondo para que el título web `"Antoniette"` en tipografía *Playfair Display* descanse con total nitidez y sin duplicidades.
* **Efecto cinemático Ken Burns:** La imagen tiene un desplazamiento horizontal continuo y suave de 22 segundos (`x: ["-3.5%", "3.5%", "-3.5%"]` con respiración de escala) que recorre el salón: desde las flores de cerezo a la izquierda, pasando por la barra, hasta las mesas y la vista a la terraza.
* **Halo de contraste:** Las letras blancas y doradas cuentan con un suave sombreado posterior que asegura máxima legibilidad en cualquier monitor.

### B. Transiciones Sedosas y Acabado Editorial
* **Sin cortes duros:** Se eliminaron las líneas rectas oscuras entre bloques. Las secciones se funden orgánicamente con degradados continuos (`bg-gradient-to-b from-background via-[#20241E] to-background`) y máscaras difuminadas de 120px.
* **Divisores de alta cocina italiana:** Enlace visual entre secciones con filamentos dorados desvanecidos y sellos sutiles (*Antoniette*, *Rooftop*, *Esperienze*).
* **Scrollbar invisible y flotante:** En `app/globals.css`, el riel de la barra de desplazamiento es 100% transparente y la pastilla es una cápsula dorada ultra fina de 6px sin las flechas toscas de Windows.

### C. Menú Digital Oficial Completo
* Extraído directamente del PDF oficial de 15 páginas de Antoniette (`public/menu-antoniette.pdf`).
* **5 Categorías Interactivas:**
  1. *Antipasti & Ensaladas* (Burrata Pugliese, Carpaccio di Manzo, Focaccia Trufada...)
  2. *Pastas & Focaccia* (Tagliolini al Tartufo, Pappardelle al Ragù di Cinghiale...)
  3. *Pizzas Artesanales* (Margherita D.O.P., Quattro Formaggi con Miele...)
  4. *Segundos & Risotto* (Risotto ai Funghi Porcini, Bistecca alla Fiorentina...)
  5. *Coctelería & Vinos* (Aperol Spritz, Negroni Classico, Chianti Classico...)
* Diseño editorial de 2 columnas con línea punteada, precios dorados, badges de autor (*"Firma Che Luis"*, *"Plato Estrella"*) y botón directo de descarga del PDF.

### D. Contacto Directo
* Ubicación física exacta en Santo Domingo con mapa interactivo.
* Canales directos: Enlace dinámico a WhatsApp (`099 897 1785`) y botón de llamada telefónica directa.

---

## 3. Sistema de Subida y Optimización con Cloudinary (Nuevo)

Se implementó el servicio completo de subida con transformaciones automáticas agresivas para garantizar que las fotos de comida pesen **menos de 100 KB**:

1. **Configuración SDK (`lib/cloudinary.ts`):**  
   Streaming directo con `upload_stream` aplicando:
   * `width: 800` y `crop: 'limit'` (redimensión inteligente sin distorsión).
   * `quality: 'auto'` (compresión óptima sin pérdida visible).
   * `fetch_format: 'auto'` (conversión instantánea a WebP o AVIF).
2. **Endpoint API (`app/api/upload/route.ts`):**  
   Ruta `POST` que valida headers `multipart/form-data`, tipos MIME permitidos (JPG, PNG, WebP, HEIC), tamaño máximo (10 MB) y devuelve JSON con `secure_url`, `public_id` y porcentaje de compresión.
3. **Componente de Frontend (`components/admin/DishImageUpload.tsx`):**  
   Componente listo para producción con soporte para arrastrar y soltar (Drag & Drop), preview local instantáneo, spinner animado, métricas de compresión en tiempo real y callback `onUploadSuccess`.
4. **Credenciales Vinculadas (`.env.local`):**  
   * `CLOUDINARY_CLOUD_NAME="gpjsyq8h"`
   * `CLOUDINARY_API_KEY="954299952493557"`
   * `CLOUDINARY_API_SECRET="-4uFZ7cVt2avAJ-4ciAgaeX7N7c"`
   * *Prueba en vivo superada con éxito:* Reducción comprobada del **94%** (de 115 KB a solo **6.6 KB**).

---

## 4. Limpieza Realizada

Se eliminaron más de 70 archivos obsoletos del ecommerce antiguo:
* `app/reservar` y `app/mis-reservas`
* `app/(auth)` y `app/(store)`
* `app/admin` y `app/empleado`
* `app/actions` y `app/api` (antiguo Stripe, Payphone, etc.)
* Componentes de carrito, tiendas y tablas viejas.
* *Nota:* Existe una copia de respaldo segura en `.gemini/antigravity-ide/brain/.../scratch/old_ecommerce_backup.zip`.

---

## 5. Skills de Agente Instaladas

Tienes configuradas y sincronizadas a nivel global y de proyecto las siguientes skills:
* `find-skills` (Búsqueda e instalación de nuevas habilidades)
* `copywriting`, `copywriting-cta`, `copywriting-hooks` (Redacción publicitaria de alta conversión)
* `sales-enablement` (Estrategia comercial y de ventas)
* `better-layout` y `better-typography` (Pautas de diseño visual, rejillas y tipografía)
* `web-design-guidelines` (Auditoría de UX/UI y accesibilidad)

---

## 6. Estructura Actual de Archivos

```text
antoniette-app/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Endpoint optimizador de Cloudinary
│   ├── globals.css               # Estilos globales, paleta oscura y scrollbar
│   ├── layout.tsx                # Metadata y fuentes Playfair / Inter
│   └── page.tsx                  # Landing page completa de Antoniette
├── components/
│   └── admin/
│       └── DishImageUpload.tsx   # Componente Drag & Drop para fotos de platos
├── lib/
│   └── cloudinary.ts             # SDK oficial y utilidades de optimización
├── public/
│   ├── images/
│   │   ├── hero-antoniette-clean.jpg  # Portada panorámica 2.7K procesada
│   │   └── logo-transparent.png
│   └── menu-antoniette.pdf       # Carta oficial descargable
├── .env.example
├── .env.local                    # Credenciales Cloudinary (en .gitignore)
├── package.json
└── NUEVAPAGINA.md                # Este documento de control
```

---

## 7. Próximos Pasos Sugeridos

Cuando regreses a hacer cambios, podemos:
1. **Formulario de Platos:** Crear la pantalla o modal para dar de alta platos usando el componente `DishImageUpload`.
2. **Conexión a Base de Datos:** Definir el modelo de datos para los platos si deseas almacenarlos dinámicamente.
3. **Galería Dinámica del Menú:** Mostrar en la landing las fotos subidas a Cloudinary para cada plato del menú.
