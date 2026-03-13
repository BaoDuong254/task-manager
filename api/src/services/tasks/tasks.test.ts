import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  context,
} from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { tasks, task, createTask, updateTask, deleteTask } from './tasks'

describe('tasks', () => {
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

  const createOwnedTask = async (
    projectId: number,
    title: string,
    overrides: Record<string, unknown> = {}
  ) => {
    return db.task.create({
      data: {
        projectId,
        title,
        status: 'TODO',
        priority: 'MEDIUM',
        ...overrides,
      },
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

  it('returns only tasks owned by the current user', async () => {
    const userOne = await createUser('tasks-owner-one')
    const userTwo = await createUser('tasks-owner-two')
    const ownProject = await createOwnedProject(userOne.id, 'Personal')
    const foreignProject = await createOwnedProject(userTwo.id, 'Team')
    const ownTask = await createOwnedTask(ownProject.id, 'Own task')

    await createOwnedTask(foreignProject.id, 'Foreign task')

    setCurrentUser(userOne)

    const result = (await tasks({})) as {
      results: Array<{ id: number }>
      totalCount: number
    }

    expect(result.totalCount).toEqual(1)
    expect(result.results[0].id).toEqual(ownTask.id)
  })

  it('returns a single owned task', async () => {
    const user = await createUser('single-task-owner')
    const projectRecord = await createOwnedProject(user.id, 'Inbox')
    const ownTask = await createOwnedTask(projectRecord.id, 'Review PR')

    setCurrentUser(user)

    const result = await task({ id: ownTask.id })

    expect(result?.id).toEqual(ownTask.id)
    expect(result?.title).toEqual('Review PR')
  })

  it('returns null when requesting a task owned by another user', async () => {
    const userOne = await createUser('task-reader-one')
    const userTwo = await createUser('task-reader-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Foreign')
    const foreignTask = await createOwnedTask(foreignProject.id, 'Restricted')

    setCurrentUser(userOne)

    const result = await task({ id: foreignTask.id })

    expect(result).toEqual(null)
  })

  it('filters tasks by search for the current user only', async () => {
    const user = await createUser('task-search-owner')
    const projectRecord = await createOwnedProject(user.id, 'Search Project')
    await createOwnedTask(projectRecord.id, 'Sprint planning')
    await createOwnedTask(projectRecord.id, 'Bug triage')

    setCurrentUser(user)

    const result = (await tasks({ filter: { search: 'sprint' } })) as {
      results: Array<{ title: string }>
      totalCount: number
    }

    expect(result.totalCount).toEqual(1)
    expect(result.results[0].title).toEqual('Sprint planning')
  })

  it('creates a task in a project owned by the current user', async () => {
    const user = await createUser('task-create-owner')
    const projectRecord = await createOwnedProject(user.id, 'Delivery')

    setCurrentUser(user)

    const result = await createTask({
      input: {
        projectId: projectRecord.id,
        title: 'Prepare release notes',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    })

    expect(result.projectId).toEqual(projectRecord.id)
    expect(result.title).toEqual('Prepare release notes')
    expect(result.status).toEqual('TODO')
    expect(result.priority).toEqual('MEDIUM')
  })

  it('rejects creating a task in another user project', async () => {
    const userOne = await createUser('task-create-user-one')
    const userTwo = await createUser('task-create-user-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Locked')

    setCurrentUser(userOne)

    await expect(
      createTask({
        input: {
          projectId: foreignProject.id,
          title: 'Forbidden task',
          status: 'TODO',
          priority: 'LOW',
        },
      })
    ).rejects.toThrow(UserInputError)
  })

  it('updates a task owned by the current user', async () => {
    const user = await createUser('task-update-owner')
    const projectRecord = await createOwnedProject(user.id, 'Planning')
    const original = await createOwnedTask(projectRecord.id, 'Draft task')

    setCurrentUser(user)

    const result = await updateTask({
      id: original.id,
      input: { title: 'Published task' },
    })

    expect(result.title).toEqual('Published task')
  })

  it('rejects updating a task owned by another user', async () => {
    const userOne = await createUser('task-update-user-one')
    const userTwo = await createUser('task-update-user-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Confidential')
    const foreignTask = await createOwnedTask(foreignProject.id, 'Hidden task')

    setCurrentUser(userOne)

    await expect(
      updateTask({ id: foreignTask.id, input: { title: 'Blocked' } })
    ).rejects.toThrow(ForbiddenError)
  })

  it('deletes a task owned by the current user', async () => {
    const user = await createUser('task-delete-owner')
    const projectRecord = await createOwnedProject(user.id, 'Cleanup')
    const ownTask = await createOwnedTask(projectRecord.id, 'Remove me')

    setCurrentUser(user)

    const original = await deleteTask({ id: ownTask.id })
    const result = await task({ id: original.id })

    expect(result).toEqual(null)
  })

  it('rejects deleting a task owned by another user', async () => {
    const userOne = await createUser('task-delete-user-one')
    const userTwo = await createUser('task-delete-user-two')
    const foreignProject = await createOwnedProject(userTwo.id, 'Protected')
    const foreignTask = await createOwnedTask(
      foreignProject.id,
      'Do not delete'
    )

    setCurrentUser(userOne)

    await expect(deleteTask({ id: foreignTask.id })).rejects.toThrow(
      ForbiddenError
    )
  })

  it('requires authentication to list tasks', async () => {
    context.currentUser = undefined

    await expect(tasks({})).rejects.toThrow(AuthenticationError)
  })
})
