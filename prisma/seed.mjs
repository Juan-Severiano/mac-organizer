import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.schedule.deleteMany();
  await prisma.currentUser.deleteMany();
  await prisma.user.deleteMany();

  const members = [
    'Luiz',
    'Diego',
    'Juan',
    'Michel',
    'Fernanda',
    'Rafael',
    'Henrique'
  ];

  for (const name of members) {
    await prisma.user.create({
      data: { name }
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  