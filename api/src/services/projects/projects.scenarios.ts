import type { Prisma, Project } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProjectCreateArgs>({
  project: {
    one: {
      data: {
        name: 'String',
        updatedAt: '2026-03-10T10:35:06.571Z',
        user: {
          create: {
            email: 'String2673814',
            username: 'String1025453',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-03-10T10:35:06.583Z',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        updatedAt: '2026-03-10T10:35:06.583Z',
        user: {
          create: {
            email: 'String9670435',
            username: 'String2558239',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-03-10T10:35:06.594Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Project, 'project'>
