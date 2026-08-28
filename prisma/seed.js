const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('admin123', salt);
  const employeeHash = await bcrypt.hash('empleado123', salt);
  const clientHash = await bcrypt.hash('cliente123', salt);

  // Clean existing tables to avoid duplicate key issues
  await prisma.table.deleteMany({});
  
  // Seed 10 tables
  const tablesData = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 2 },
    { number: 4, capacity: 2 },
    { number: 5, capacity: 4 },
    { number: 6, capacity: 4 },
    { number: 7, capacity: 4 },
    { number: 8, capacity: 4 },
    { number: 9, capacity: 6 },
    { number: 10, capacity: 8 },
  ];

  for (const table of tablesData) {
    await prisma.table.create({ data: table });
  }
  console.log('Seeded 10 tables successfully.');

  // Create or Update Seed Users
  const users = [
    { email: 'admin@antoniette.com', passwordHash: adminHash, role: 'ADMIN' },
    { email: 'empleado@antoniette.com', passwordHash: employeeHash, role: 'EMPLEADO' },
    { email: 'cliente@antoniette.com', passwordHash: clientHash, role: 'CLIENTE' }
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      await prisma.user.create({ data: user });
      console.log(`User created: ${user.email} with role: ${user.role}`);
    } else {
      await prisma.user.update({
        where: { email: user.email },
        data: { role: user.role }
      });
      console.log(`User updated: ${user.email} to role: ${user.role}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
