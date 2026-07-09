const fs = require('fs');
const path = require('path');

const replacements = {
  // Storefront
  'Redefining <span className="text-accent">Premium</span>': 'Redefiniendo lo <span className="text-accent">Premium</span>',
  'Discover our curated collection of high-end accessories and tech essentials.': 'Descubre nuestra colección de accesorios y tecnología de alta gama.',
  'Designed for those who demand excellence in every detail.': 'Diseñado para quienes exigen excelencia en cada detalle.',
  'Shop Collection': 'Ver Colección',
  'Latest Arrivals': 'Últimas Novedades',
  'Explore the newest additions to our catalog.': 'Explora las nuevas adiciones a nuestro catálogo.',
  'No products found. Add some from the admin dashboard.': 'No se encontraron productos. Agrega algunos desde el panel de administración.',
  
  // ProductCard
  'Sold Out': 'Agotado',
  
  // Navbar
  'Shop': 'Tienda',
  'Collections': 'Colecciones',
  'About': 'Nosotros',
  
  // CartDrawer
  'Your Cart': 'Tu Carrito',
  'Your cart is empty.': 'Tu carrito está vacío.',
  'Continue Shopping': 'Seguir Comprando',
  'Subtotal': 'Subtotal',
  'Checkout with Stripe': 'Pagar con Stripe',
  'Shipping and taxes calculated at checkout.': 'Envío e impuestos se calculan al pagar.',
  
  // Product Detail
  'Back to Catalog': 'Volver al Catálogo',
  'Ships within 24 hours': 'Envío en 24 horas',
  'Secure transaction': 'Transacción segura',
  
  // AddToCartButton
  'Out of Stock': 'Agotado',
  'Quantity': 'Cantidad',
  'available': 'disponibles',
  'Added to Cart!': '¡Agregado!',
  'Add to Cart - $': 'Agregar - $',
  
  // Success
  'Order Confirmed!': '¡Orden Confirmada!',
  "Thank you for your purchase. We've received your order and will begin processing it right away.": 'Gracias por tu compra. Hemos recibido tu orden y la procesaremos de inmediato.',
  
  // Admin Products
  "Manage your store's inventory and pricing.": 'Gestiona el inventario y precios de tu tienda.',
  'Add Product': 'Agregar Producto',
  'Product': 'Producto',
  'Price': 'Precio',
  'Stock': 'Inventario',
  'Category': 'Categoría',
  'Status': 'Estado',
  'Actions': 'Acciones',
  'in stock': 'en stock',
  'Uncategorized': 'Sin categoría',
  'Active': 'Activo',
  'Draft': 'Borrador',
  'Showing page': 'Mostrando página',
  'of': 'de',
  'Previous': 'Anterior',
  'Next': 'Siguiente',
  
  // ProductForm
  'Edit Product': 'Editar Producto',
  'New Product': 'Nuevo Producto',
  'Save Changes': 'Guardar Cambios',
  'Create Product': 'Crear Producto',
  'Basic Information': 'Información Básica',
  'Product Name': 'Nombre del Producto',
  'Slug (URL-friendly)': 'Slug (URL amigable)',
  'Description': 'Descripción',
  'Describe the product...': 'Describe el producto...',
  'Pricing & Inventory': 'Precio e Inventario',
  'Stock Quantity': 'Cantidad en Inventario',
  'Organization': 'Organización',
  'Select a category': 'Selecciona una categoría',
  'Active (Visible in store)': 'Activo (Visible en tienda)',
  'Product Image': 'Imagen del Producto',
  'No image uploaded': 'Sin imagen',
  'Change Image': 'Cambiar Imagen',
  'Upload Image': 'Subir Imagen',
  'Recommended: 800x800px or larger. JPEG, PNG, or WebP.': 'Recomendado: 800x800px o mayor. JPEG, PNG o WebP.'
};

const dirs = ['app', 'components'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const [eng, span] of Object.entries(replacements)) {
    if (content.includes(eng)) {
      content = content.split(eng).join(span);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Translated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

dirs.forEach(d => walkDir(path.join(process.cwd(), d)));
console.log('Translation complete!');
