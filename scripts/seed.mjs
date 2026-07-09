import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: "Midnight Obsidian Keyboard",
    slug: "midnight-obsidian-keyboard",
    description: "A premium mechanical keyboard featuring custom tactile switches, RGB underglow, and an aerospace-grade aluminum chassis.",
    price: 189.99,
    stock: 50,
    images: JSON.stringify(["https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  },
  {
    name: "Lumina Studio Headphones",
    slug: "lumina-studio-headphones",
    description: "High-fidelity wireless over-ear headphones with active noise cancellation and 40 hours of battery life.",
    price: 249.00,
    stock: 120,
    images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  },
  {
    name: "Zenith Minimalist Watch",
    slug: "zenith-minimalist-watch",
    description: "A sleek, matte black analog watch with sapphire crystal glass and a genuine leather strap.",
    price: 125.50,
    stock: 15,
    images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  },
  {
    name: "Aero Mesh Chair",
    slug: "aero-mesh-chair",
    description: "Ergonomic office chair designed for long hours. Features breathable mesh, adjustable lumbar support, and 4D armrests.",
    price: 349.99,
    stock: 0, // Out of stock example
    images: JSON.stringify(["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  },
  {
    name: "Neon Glow Desk Mat",
    slug: "neon-glow-desk-mat",
    description: "Extended gaming mouse pad with stitched edges and a water-resistant surface.",
    price: 29.99,
    stock: 200,
    images: JSON.stringify(["https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  },
  {
    name: "Echo Smart Speaker",
    slug: "echo-smart-speaker",
    description: "Compact smart speaker with immersive sound, voice control, and smart home integration.",
    price: 89.99,
    stock: 45,
    images: JSON.stringify(["https://images.unsplash.com/photo-1589003071536-46c00af1f11a?auto=format&fit=crop&q=80&w=800"]),
    isActive: true,
  }
]

async function main() {
  console.log('Seeding database with premium products...')
  
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Premium electronic devices and accessories.'
    }
  })

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        categoryId: category.id,
      }
    })
  }

  console.log('Seed completed successfully! 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
