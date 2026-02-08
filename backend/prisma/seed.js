const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@boardwall.com' },
    update: {},
    create: {
      email: 'admin@boardwall.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@boardwall.com' },
    update: {},
    create: {
      email: 'manager@boardwall.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@boardwall.com' },
    update: {},
    create: {
      email: 'member@boardwall.com',
      password: hashedPassword,
      firstName: 'Member',
      lastName: 'User',
      role: 'MEMBER',
    },
  });

  console.log('Users created:', { admin, manager, member });

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      description: 'A demo organization for BoardWall',
      users: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: manager.id, role: 'MEMBER' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('Organization created:', organization);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesign the company website',
      organizationId: organization.id,
      status: 'ACTIVE',
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: manager.id, role: 'MEMBER' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build a new mobile app',
      organizationId: organization.id,
      status: 'ACTIVE',
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('Projects created:', { project1, project2 });

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Homepage',
      description: 'Create mockup for the new homepage',
      projectId: project1.id,
      assigneeId: manager.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-03-01'),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Setup Backend API',
      description: 'Initialize NestJS backend',
      projectId: project1.id,
      assigneeId: member.id,
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2026-02-15'),
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Create User Authentication',
      description: 'Implement JWT authentication',
      projectId: project2.id,
      assigneeId: admin.id,
      status: 'TODO',
      priority: 'URGENT',
      dueDate: new Date('2026-02-20'),
    },
  });

  console.log('Tasks created:', { task1, task2, task3 });

  // Create time entries
  const timeEntry1 = await prisma.timeEntry.create({
    data: {
      taskId: task1.id,
      userId: manager.id,
      startTime: new Date('2026-02-01T09:00:00'),
      endTime: new Date('2026-02-01T12:00:00'),
      duration: 10800, // 3 hours in seconds
      notes: 'Working on initial designs',
    },
  });

  const timeEntry2 = await prisma.timeEntry.create({
    data: {
      taskId: task2.id,
      userId: member.id,
      startTime: new Date('2026-02-02T10:00:00'),
      endTime: new Date('2026-02-02T17:00:00'),
      duration: 25200, // 7 hours in seconds
      notes: 'Setup complete',
    },
  });

  console.log('Time entries created:', { timeEntry1, timeEntry2 });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
