import { db } from 'src/lib/db'

import {
  userCredentials,
  userCredential,
  createUserCredential,
  updateUserCredential,
  deleteUserCredential,
} from './userCredentials'

describe('userCredentials', () => {
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

  const createCredential = async (userId: number, id: string) => {
    return db.userCredential.create({
      data: {
        id,
        userId,
        publicKey: Buffer.from([1, 2, 3]),
        counter: BigInt(5),
      },
    })
  }

  beforeEach(async () => {
    await db.userCredential.deleteMany()
    await db.task.deleteMany()
    await db.project.deleteMany()
    await db.user.deleteMany()
  })

  afterEach(async () => {
    await db.userCredential.deleteMany()
    await db.task.deleteMany()
    await db.project.deleteMany()
    await db.user.deleteMany()
  })

  it('returns all userCredentials', async () => {
    const userOne = await createUser('credential-list-one')
    const userTwo = await createUser('credential-list-two')
    await createCredential(userOne.id, 'cred-one')
    await createCredential(userTwo.id, 'cred-two')

    const result = await userCredentials()

    expect(result).toHaveLength(2)
  })

  it('returns a single userCredential', async () => {
    const user = await createUser('credential-single')
    const credential = await createCredential(user.id, 'cred-single')

    const result = await userCredential({ id: credential.id })

    expect(result?.id).toEqual('cred-single')
    expect(result?.userId).toEqual(user.id)
  })

  it('creates a userCredential', async () => {
    const user = await createUser('credential-create')

    const result = await createUserCredential({
      input: {
        id: 'credential-new',
        userId: user.id,
        publicKey: Buffer.from([143, 246, 160]),
        counter: 2120934,
      },
    })

    expect(result.id).toEqual('credential-new')
    expect(result.userId).toEqual(user.id)
    expect(result.publicKey).toEqual(Buffer.from([143, 246, 160]))
    expect(result.counter).toEqual(BigInt(2120934))
  })

  it('updates a userCredential counter', async () => {
    const user = await createUser('credential-update')
    const original = await createCredential(user.id, 'cred-update')

    const result = await updateUserCredential({
      id: original.id,
      input: { id: original.id, counter: 99 },
    })

    expect(result.id).toEqual('cred-update')
    expect(result.counter).toEqual(BigInt(99))
  })

  it('deletes a userCredential', async () => {
    const user = await createUser('credential-delete')
    const credential = await createCredential(user.id, 'cred-delete')

    const original = await deleteUserCredential({
      id: credential.id,
    })
    const result = await userCredential({ id: original.id })

    expect(result).toEqual(null)
  })

  it('stores credentials under the related user', async () => {
    const user = await createUser('credential-relation')
    const credential = await createCredential(user.id, 'cred-relation')

    const result = await db.user.findUnique({
      where: { id: user.id },
      include: { credentials: true },
    })

    expect(result?.credentials).toHaveLength(1)
    expect(result?.credentials[0].id).toEqual(credential.id)
  })
})
