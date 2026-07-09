const fs = require('fs');

function replace(file, bad, good) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes(bad)) {
    c = c.split(bad).join(good);
    fs.writeFileSync(file, c);
    console.log('Fixed:', file);
  }
}

replace('app/admin/products/page.tsx', 'product.isActivo', 'product.isActive');
replace('app/admin/products/ProductForm.tsx', 'isActive?: boolean', 'isActive?: boolean');
replace('app/admin/products/ProductForm.tsx', 'isActivo:', 'isActive:');
replace('app/api/checkout/route.ts', 'SiguienteResponse', 'NextResponse');
replace('app/api/webhooks/stripe/route.ts', 'SiguienteResponse', 'NextResponse');
replace('components/cart/CartDrawer.tsx', 'updateCantidad', 'updateQuantity');
replace('components/store/AddToCartButton.tsx', 'Producto }', 'Product }');
replace('components/store/ProductCard.tsx', 'Producto }', 'Product }');
replace('components/store/AddToCartButton.tsx', 'product: Producto', 'product: Product');
replace('components/store/ProductCard.tsx', 'product: Producto', 'product: Product');
