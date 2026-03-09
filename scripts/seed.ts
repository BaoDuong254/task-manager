import { db } from 'api/src/lib/db'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

export default async () => {
  try {
    // Seed Users
    const users = await Promise.all([
      db.user.create({
        data: {
          email: 'alice@example.com',
          username: 'alice',
          hashedPassword: 'password123',
          salt: 'random_salt_value',
        },
      }),
      db.user.create({
        data: {
          email: 'bob@example.com',
          username: 'bob',
          hashedPassword: 'password123',
          salt: 'random_salt_value',
        },
      }),
      db.user.create({
        data: {
          email: 'charlie@example.com',
          username: 'charlie',
          hashedPassword: 'password123',
          salt: 'random_salt_value',
        },
      }),
    ])

    console.info(`  Seeded ${users.length} users`)

    // Seed Projects
    const projects = await Promise.all([
      db.project.create({
        data: {
          name: 'Website Redesign',
          description: 'Redesign the company website with new branding',
          userId: users[0].id,
        },
      }),
      db.project.create({
        data: {
          name: 'Mobile App',
          description: 'Build a cross-platform mobile application',
          userId: users[0].id,
        },
      }),
      db.project.create({
        data: {
          name: 'API Integration',
          description: 'Integrate third-party payment API',
          userId: users[1].id,
        },
      }),
      db.project.create({
        data: {
          name: 'Data Migration',
          description: 'Migrate legacy database to new schema',
          userId: users[2].id,
        },
      }),
    ])

    console.info(`  Seeded ${projects.length} projects`)

    // Seed Tasks
    const tasks = await Promise.all([
      // Tasks for "Website Redesign"
      db.task.create({
        data: {
          projectId: projects[0].id,
          title: 'Create wireframes',
          description: 'Design wireframes for all main pages',
          status: 'COMPLETED',
          priority: 'HIGH',
          dueDate: new Date('2026-03-15'),
        },
      }),
      db.task.create({
        data: {
          projectId: projects[0].id,
          title: 'Implement homepage',
          description: 'Build the new homepage based on approved wireframes',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2026-03-25'),
        },
      }),
      db.task.create({
        data: {
          projectId: projects[0].id,
          title: 'Set up CI/CD pipeline',
          description: 'Configure automated deployment for the website',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date('2026-04-01'),
        },
      }),

      // Tasks for "Mobile App"
      db.task.create({
        data: {
          projectId: projects[1].id,
          title: 'Set up React Native project',
          description: 'Initialize the project with required dependencies',
          status: 'COMPLETED',
          priority: 'HIGH',
        },
      }),
      db.task.create({
        data: {
          projectId: projects[1].id,
          title: 'Design login screen',
          description: 'Create UI for user authentication',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: new Date('2026-03-20'),
        },
      }),
      db.task.create({
        data: {
          projectId: projects[1].id,
          title: 'Push notification integration',
          description: 'Integrate Firebase for push notifications',
          status: 'TODO',
          priority: 'LOW',
          dueDate: new Date('2026-04-10'),
        },
      }),

      // Tasks for "API Integration"
      db.task.create({
        data: {
          projectId: projects[2].id,
          title: 'Research payment providers',
          description: 'Compare Stripe, PayPal, and Square APIs',
          status: 'COMPLETED',
          priority: 'HIGH',
        },
      }),
      db.task.create({
        data: {
          projectId: projects[2].id,
          title: 'Implement Stripe checkout',
          description: 'Build checkout flow with Stripe API',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date('2026-03-30'),
        },
      }),

      // Tasks for "Data Migration"
      db.task.create({
        data: {
          projectId: projects[3].id,
          title: 'Audit existing database',
          description: 'Document current schema and data relationships',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2026-03-12'),
        },
      }),
      db.task.create({
        data: {
          projectId: projects[3].id,
          title: 'Write migration scripts',
          description: 'Create scripts to transform and migrate data',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date('2026-03-28'),
        },
      }),
      db.task.create({
        data: {
          projectId: projects[3].id,
          title: 'Validate migrated data',
          description: 'Run integrity checks on migrated records',
          status: 'TODO',
          priority: 'LOW',
          dueDate: new Date('2026-04-05'),
        },
      }),
    ])

    console.info(`  Seeded ${tasks.length} tasks`)
    console.info('\n  Seeding complete!\n')
  } catch (error) {
    console.error(error)
  }
}
