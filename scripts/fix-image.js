const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const newImage = 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=800'; // Actually working image of a speaker
  
  await prisma.product.updateMany({
    where: { slug: 'echo-smart-speaker' },
    data: { images: JSON.stringify([newImage]) }
  });
  
  console.log('Fixed Echo Smart Speaker image!');
  await prisma.$disconnect();
}

main();
