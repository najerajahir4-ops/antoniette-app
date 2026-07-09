const fs = require('fs');
const path = require('path');

const replacements = {
  'TiendapingBag': 'ShoppingBag',
  'TiendapingCart': 'ShoppingCart',
  'ProductoCard': 'ProductCard',
  'ProductoForm': 'ProductForm',
  "Producto } from '@prisma/client'": "Product } from '@prisma/client'",
  'Producto } from "@prisma/client"': 'Product } from "@prisma/client"',
  '<ProductoCard': '<ProductCard',
  'ProductFormValues': 'ProductFormValues'
};

const dirs = ['app', 'components'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const [bad, good] of Object.entries(replacements)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed: ${filePath}`);
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
console.log('Fix complete!');
