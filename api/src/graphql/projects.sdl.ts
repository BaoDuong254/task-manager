export const schema = gql`
  type Project {
    id: Int!
    name: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
    userId: Int!
    user: User!
    tasks: [Task]!
  }

  type Query {
    projects(search: String): [Project!]! @requireAuth
    project(id: Int!): Project @requireAuth
  }

  input CreateProjectInput {
    name: String!
    description: String
  }

  input UpdateProjectInput {
    name: String
    description: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project! @requireAuth
    updateProject(id: Int!, input: UpdateProjectInput!): Project! @requireAuth
    deleteProject(id: Int!): Project! @requireAuth
  }
`
