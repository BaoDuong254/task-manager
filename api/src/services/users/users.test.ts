import type { User } from '@prisma/client'

import { context } from '@redwoodjs/graphql-server'

import { users, user, createUser, updateUser, deleteUser } from './users'
import { updateMyUsername } from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
  afterEach(() => {
    context.currentUser = undefined
  })

  const setCurrentUserFromScenario = (scenario: StandardScenario) => {
    context.currentUser = {
      id: scenario.user.one.id,
      email: scenario.user.one.email,
      username: scenario.user.one.username,
    }
  }

  scenario('returns all users', async (scenario: StandardScenario) => {
    const result = await users()

    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario: StandardScenario) => {
    const result = await user({ id: scenario.user.one.id })

    expect(result).toEqual(scenario.user.one)
  })

  scenario('creates a user', async () => {
    const result = await createUser({
      input: {
        email: 'String869507',
        username: 'String5903048',
        hashedPassword: 'String',
        salt: 'String',
      },
    })

    expect(result.email).toEqual('String869507')
    expect(result.username).toEqual('String5903048')
    expect(result.hashedPassword).toEqual('String')
    expect(result.salt).toEqual('String')
  })

  scenario('updates a user', async (scenario: StandardScenario) => {
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { email: 'String50077922' },
    })

    expect(result.email).toEqual('String50077922')
  })

  scenario(
    'updates the current user username after trimming input',
    async (scenario: StandardScenario) => {
      setCurrentUserFromScenario(scenario)

      const result = await updateMyUsername({ username: '  renamed-user  ' })

      expect(result.id).toEqual(scenario.user.one.id)
      expect(result.username).toEqual('renamed-user')
    }
  )

  scenario(
    'rejects an empty username for the current user',
    async (scenario: StandardScenario) => {
      setCurrentUserFromScenario(scenario)

      await expect(updateMyUsername({ username: '   ' })).rejects.toThrow(
        'Username is required'
      )
    }
  )

  scenario(
    'rejects a username that is too short',
    async (scenario: StandardScenario) => {
      setCurrentUserFromScenario(scenario)

      await expect(updateMyUsername({ username: 'a' })).rejects.toThrow(
        'Username must be 2–50 characters'
      )
    }
  )

  scenario('deletes a user', async (scenario: StandardScenario) => {
    const original = (await deleteUser({ id: scenario.user.one.id })) as User
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
  })
})
