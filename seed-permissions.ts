import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    { name: 'view_profile', description: 'View employee profiles' },
    { name: 'update_profile', description: 'Update employee profiles' },
    { name: 'apply_leave', description: 'Apply for leave' },
    { name: 'approve_leave', description: 'Approve/reject leave requests' },
    { name: 'view_salary', description: 'View salary details' },
    { name: 'manage_salary', description: 'Add/update salary details' },
    { name: 'mark_attendance', description: 'Mark daily attendance' },
    { name: 'view_attendance', description: 'View attendance records' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }
}

main()
  .then(() => console.log('Permissions seeded successfully'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());