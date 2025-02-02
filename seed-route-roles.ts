import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const routeRoles = [
    { route: '/salary/all', roles: ['HR', 'ADMIN'] },
    { route: '/leave/all', roles: ['HR', 'ADMIN'] },
    { route: '/roles', roles: ['ADMIN'] },
  ];

  for (const routeRole of routeRoles) {
    await prisma.routeRole.upsert({
      where: { route: routeRole.route },
      update: { roles: routeRole.roles },
      create: routeRole,
    });
  }
}

main()
  .then(() => console.log('Route roles seeded successfully'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());