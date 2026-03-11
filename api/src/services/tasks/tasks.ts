import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  TaskRelationResolvers,
} from 'types/graphql'

import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  context,
} from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

const getCurrentUserId = () => {
  const userId = context.currentUser?.id

  if (!userId) {
    throw new AuthenticationError('You must be logged in.')
  }

  return userId
}

const buildTaskWhere = ({
  filter,
  userId,
}: {
  filter?: Parameters<QueryResolvers['tasks']>[0]['filter']
  userId: number
}): Prisma.TaskWhereInput => {
  const where: Prisma.TaskWhereInput = {
    deletedAt: null,
    project: {
      deletedAt: null,
      userId,
    },
  }

  if (filter?.status) {
    where.status = filter.status
  }

  if (filter?.priority) {
    where.priority = filter.priority
  }

  if (filter?.projectId) {
    where.projectId = filter.projectId
  }

  if (filter?.search) {
    where.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
    ]
  }

  return where
}

const buildTaskOrderBy = ({
  sort,
}: {
  sort?: Parameters<QueryResolvers['tasks']>[0]['sort']
}): Prisma.TaskOrderByWithRelationInput[] => {
  if (!sort) {
    return [{ createdAt: 'desc' }]
  }

  const direction = sort.direction === 'ASC' ? 'asc' : 'desc'

  switch (sort.field) {
    case 'DEADLINE':
      return [{ dueDate: direction }]
    case 'PRIORITY':
      return [{ priority: direction }]
    case 'CREATED_AT':
    default:
      return [{ createdAt: direction }]
  }
}

export const tasks: QueryResolvers['tasks'] = async ({
  filter,
  sort,
  pagination,
}) => {
  const userId = getCurrentUserId()

  const page = pagination?.page && pagination.page > 0 ? pagination.page : 1
  const pageSize =
    pagination?.pageSize && pagination.pageSize > 0 ? pagination.pageSize : 20

  const where = buildTaskWhere({ filter, userId })
  const orderBy = buildTaskOrderBy({ sort })

  const [results, totalCount] = await Promise.all([
    db.task.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.task.count({ where }),
  ])

  return {
    results,
    totalCount,
    page,
    pageSize,
  }
}

export const task: QueryResolvers['task'] = async ({ id }) => {
  const userId = getCurrentUserId()

  return db.task.findFirst({
    where: {
      id,
      deletedAt: null,
      project: {
        deletedAt: null,
        userId,
      },
    },
  })
}

export const taskAnalytics: QueryResolvers['taskAnalytics'] = async ({
  projectId,
}) => {
  const userId = getCurrentUserId()

  const baseWhere: Prisma.TaskWhereInput = {
    deletedAt: null,
    project: {
      deletedAt: null,
      userId,
    },
  }

  if (projectId) {
    baseWhere.projectId = projectId
  }

  const [todoCount, inProgressCount, completedCount, upcomingDeadlines] =
    await Promise.all([
      db.task.count({
        where: { ...baseWhere, status: 'TODO' },
      }),
      db.task.count({
        where: { ...baseWhere, status: 'IN_PROGRESS' },
      }),
      db.task.count({
        where: { ...baseWhere, status: 'COMPLETED' },
      }),
      db.task.findMany({
        where: {
          ...baseWhere,
          status: {
            in: ['TODO', 'IN_PROGRESS'],
          },
          dueDate: {
            not: null,
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
        take: 10,
      }),
    ])

  const totalCompleted = completedCount
  const totalInProgress = todoCount + inProgressCount

  return {
    todoCount,
    inProgressCount,
    completedCount,
    totalCompleted,
    totalInProgress,
    upcomingDeadlines,
  }
}

export const createTask: MutationResolvers['createTask'] = async ({
  input,
}) => {
  const userId = getCurrentUserId()

  const project = await db.project.findFirst({
    where: {
      id: input.projectId,
      deletedAt: null,
      userId,
    },
  })

  if (!project) {
    throw new UserInputError('Project does not exist or is not accessible.')
  }

  return db.task.create({
    data: input,
  })
}

export const updateTask: MutationResolvers['updateTask'] = async ({
  id,
  input,
}) => {
  const userId = getCurrentUserId()

  const existingTask = await db.task.findFirst({
    where: {
      id,
      deletedAt: null,
      project: {
        deletedAt: null,
        userId,
      },
    },
  })

  if (!existingTask) {
    throw new ForbiddenError('Task not found or not accessible.')
  }

  const nextProjectId = input.projectId ?? existingTask.projectId

  const project = await db.project.findFirst({
    where: {
      id: nextProjectId,
      deletedAt: null,
      userId,
    },
  })

  if (!project) {
    throw new UserInputError('Project does not exist or is not accessible.')
  }

  return db.task.update({
    data: {
      ...input,
      projectId: nextProjectId,
    },
    where: { id },
  })
}

export const deleteTask: MutationResolvers['deleteTask'] = async ({ id }) => {
  const userId = getCurrentUserId()

  const existingTask = await db.task.findFirst({
    where: {
      id,
      deletedAt: null,
      project: {
        deletedAt: null,
        userId,
      },
    },
  })

  if (!existingTask) {
    throw new ForbiddenError('Task not found or not accessible.')
  }

  return db.task.delete({
    where: { id },
  })
}

export const Task: TaskRelationResolvers = {
  project: (_obj, { root }) => {
    return db.task.findUnique({ where: { id: root?.id } }).project()
  },
}
