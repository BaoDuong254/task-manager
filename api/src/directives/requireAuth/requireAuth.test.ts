import { mockRedwoodDirective, getDirectiveName } from '@redwoodjs/testing/api'

import requireAuth from './requireAuth'

describe('requireAuth directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(requireAuth.schema).toBeTruthy()
    expect(getDirectiveName(requireAuth.schema)).toBe('requireAuth')
  })

  it('does not throw when a current user exists in context', () => {
    const mockExecution = mockRedwoodDirective(requireAuth, {
      context: {
        currentUser: {
          id: 1,
          email: 'user@example.com',
          username: 'directive-user',
        },
      },
    })

    expect(mockExecution).not.toThrow()
  })

  it('throws when no current user exists in context', () => {
    const mockExecution = mockRedwoodDirective(requireAuth, { context: {} })

    expect(mockExecution).toThrow("You don't have permission to do that.")
  })
})
