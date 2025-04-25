// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpar o banco de dados
  await prisma.schedule.deleteMany();
  await prisma.currentUser.deleteMany();
  await prisma.user.deleteMany();

  // Criar os 7 integrantes
  const members = [
    'Integrante 1',
    'Integrante 2',
    'Integrante 3',
    'Integrante 4',
    'Integrante 5',
    'Integrante 6',
    'Integrante 7'
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
  