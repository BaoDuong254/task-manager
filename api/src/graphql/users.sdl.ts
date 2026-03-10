export const schema = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
    credentials: [UserCredential]!
    createdAt: DateTime!
    updatedAt: DateTime!
    projects: [Project]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    username: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
  }

  input UpdateUserInput {
    email: String
    username: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
