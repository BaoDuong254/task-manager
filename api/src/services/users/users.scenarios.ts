import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String9539662',
        username: 'String7142507',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2026-03-10T10:44:09.282Z',
      },
    },
    two: {
      data: {
        email: 'String4786097',
        username: 'String4528437',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2026-03-10T10:44:09.282Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
