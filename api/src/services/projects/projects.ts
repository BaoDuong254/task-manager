import type {
  QueryResolvers,
  MutationResolvers,
  ProjectRelationResolvers,
} from 'types/graphql'

import {
  AuthenticationError,
  ForbiddenError,
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

export const projects: QueryResolvers['projects'] = () => {
  const userId = getCurrentUserId()

  return db.project.findMany({
    where: {
      deletedAt: null,
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const project: QueryResolvers['project'] = ({ id }) => {
  const userId = getCurrentUserId()

  return db.project.findFirst({
    where: {
      id,
      deletedAt: null,
      userId,
    },
  })
}

export const createProject: MutationResolvers['createProject'] = ({
  input,
}) => {
  const userId = getCurrentUserId()

  return db.project.create({
    data: {
      ...input,
      userId,
    },
  })
}

export const updateProject: MutationResolvers['updateProject'] = ({
  id,
  input,
}) => {
  return db.project.update({
    data: input,
    where: { id },
  })
}

export const deleteProject: MutationResolvers['deleteProject'] = async ({
  id,
}) => {
  const userId = getCurrentUserId()

  const existing = await db.project.findFirst({
    where: {
      id,
      deletedAt: null,
      userId,
    },
  })

  if (!existing) {
    throw new ForbiddenError('Project not found or not accessible.')
  }

  return db.project.delete({
    where: { id },
  })
}

export const Project: ProjectRelationResolvers = {
  user: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).user()
  },
  tasks: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).tasks()
  },
}
