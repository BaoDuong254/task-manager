import type { Prisma, Task } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TaskCreateArgs>({
  task: {
    one: {
      data: {
        title: 'String',
        updatedAt: '2026-03-10T10:35:18.682Z',
        project: {
          create: {
            name: 'String',
            updatedAt: '2026-03-10T10:35:18.694Z',
            user: {
              create: {
                email: 'String5203503',
                username: 'String6456059',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-03-10T10:35:18.705Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        updatedAt: '2026-03-10T10:35:18.705Z',
        project: {
          create: {
            name: 'String',
            updatedAt: '2026-03-10T10:35:18.716Z',
            user: {
              create: {
                email: 'String3129935',
                username: 'String4769670',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-03-10T10:35:18.728Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Task, 'task'>
