import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const updateMyUsername: MutationResolvers['updateMyUsername'] = async ({
  username,
}) => {
  validate(username.trim(), 'username', {
    presence: { allowEmptyString: false, message: 'Username is required' },
    length: { min: 2, max: 50, message: 'Username must be 2–50 characters' },
  })

  return db.user.update({
    where: { id: context.currentUser!.id as number },
    data: { username: username.trim() },
  })
}

export const User: UserRelationResolvers = {
  credentials: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).credentials()
  },
  projects: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).projects()
  },
}
