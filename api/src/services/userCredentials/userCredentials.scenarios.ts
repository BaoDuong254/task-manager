import type { Prisma, UserCredential } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCredentialCreateArgs>({
  userCredential: {
    one: {
      data: {
        id: 'String',
        publicKey: Buffer.from([250, 184, 103]),
        counter: 9562942,
        user: {
          create: {
            email: 'String2926442',
            username: 'String1261856',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-03-10T10:45:37.082Z',
          },
        },
      },
    },
    two: {
      data: {
        id: 'String',
        publicKey: Buffer.from([140, 60, 135]),
        counter: 3793429,
        user: {
          create: {
            email: 'String2131709',
            username: 'String3438047',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-03-10T10:45:37.091Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<UserCredential, 'userCredential'>
