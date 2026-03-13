import { ForbiddenError, context } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import {
  projects,
  project,
  createProject,
  updateProject,
  deleteProject,
} from './projects'

describe('projects', () => {
  const createUser = async (suffix: string) => {
    return db.user.create({
      data: {
        email: `${suffix}@example.com`,
        username: `${suffix}-user`,
        hashedPassword: 'hashed',
        salt: 'salt',
      },
    })
  }

  const createOwnedProject = async (userId: number, name: string) => {
    return db.project.create({
      data: { name, userId },
    })
  }

  const setCurrentUser = (user: Awaited<ReturnType<typeof createUser>>) => {
    context.currentUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    }
  }

  beforeEach(async () => {
    await db.task.deleteMany()
    await db.project.deleteMany()
    await db.userCredential.deleteMany()
    await db.user.deleteMany()
  })

  afterEach(async () => {
    context.currentUser = undefined
    await db.task.deleteMany()
    await db.project.deleteMany()
    await db.userCredential.deleteMany()
    await db.user.deleteMany()
  })

  it('returns only projects owned by the current user', async () => {
    const userOne = await createUser('projects-owner-one')
    const userTwo = await createUser('projects-owner-two')
    const ownProject = await createOwnedProject(userOne.id, 'Roadmap')

    await createOwnedProject(userTwo.id, 'Backlog')

    setCurrentUser(userOne)

    const result = (await projects({})) as Array<{ id: number }>

    expect(result).toHaveLength(1)
    expect(result[0].id).toEqual(ownProject.id)
  })

  it('returns a single owned project', async () => {
    const user = await createUser('single-project-owner')
    const ownedProject = await createOwnedProject(user.id, 'Inbox')

    setCurrentUser(user)

    const result = await project({ id: ownedProject.id })

    expect(result?.id).toEqual(ownedProject.id)
    expect(result?.name).toEqual('Inbox')
  })

  it('returns null for a project owned by another user', async () => {
    const userOne = await createUser('project-reader-one')
    const userTwo = await createUser('project-reader-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Private')

    setCurrentUser(userOne)

    const result = await project({ id: foreignProject.id })

    expect(result).toEqual(null)
  })

  it('filters projects by search term for the current user', async () => {
    const user = await createUser('project-search-user')
    await createOwnedProject(user.id, 'Marketing Roadmap')
    await createOwnedProject(user.id, 'Engineering Backlog')

    setCurrentUser(user)

    const result = (await projects({ search: 'marketing' })) as Array<{
      name: string
    }>

    expect(result).toHaveLength(1)
    expect(result[0].name).toEqual('Marketing Roadmap')
  })

  it('creates a project for the current user', async () => {
    const user = await createUser('create-project')

    setCurrentUser(user)

    const result = await createProject({
      input: {
        name: 'Client Portal',
      },
    })

    expect(result.name).toEqual('Client Portal')
    expect(result.userId).toEqual(user.id)
  })

  it('updates a project name', async () => {
    const user = await createUser('update-project-owner')
    const original = await createOwnedProject(user.id, 'Draft Name')

    const result = await updateProject({
      id: original.id,
      input: { name: 'Published Name' },
    })

    expect(result.name).toEqual('Published Name')
  })

  it('deletes a project owned by the current user', async () => {
    const user = await createUser('delete-project-owner')
    const ownedProject = await createOwnedProject(user.id, 'Disposable')

    setCurrentUser(user)

    const original = await deleteProject({
      id: ownedProject.id,
    })
    const result = await project({ id: original.id })

    expect(result).toEqual(null)
  })

  it('rejects deleting a project owned by another user', async () => {
    const userOne = await createUser('delete-project-user-one')
    const userTwo = await createUser('delete-project-user-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Protected')

    setCurrentUser(userOne)

    await expect(deleteProject({ id: foreignProject.id })).rejects.toThrow(
      ForbiddenError
    )
  })

  it('requires authentication to list projects', async () => {
    context.currentUser = undefined

    try {
      await projects({})
      throw new Error('Expected projects() to throw when unauthenticated')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toContain('You must be logged in.')
    }
  })
})
