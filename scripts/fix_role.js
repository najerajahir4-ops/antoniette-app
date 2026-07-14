const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'empleado@antoniette.com' },
      data: { role: 'EMPLEADO' }
    });
    console.log('Role updated to EMPLEADO for:', user.email);
  } catch (e) {
    console.error(e);
  }
}

main().finally(() => prisma.$disconnect());
