export const schema = gql`
  type Task {
    id: Int!
    projectId: Int!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
    project: Project!
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    COMPLETED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  input TaskFilterInput {
    status: TaskStatus
    priority: TaskPriority
    projectId: Int
    search: String
  }

  enum TaskSortField {
    DEADLINE
    PRIORITY
    CREATED_AT
  }

  enum SortDirection {
    ASC
    DESC
  }

  input TaskSortInput {
    field: TaskSortField!
    direction: SortDirection!
  }

  input PaginationInput {
    page: Int!
    pageSize: Int!
  }

  type TaskPage {
    results: [Task!]!
    totalCount: Int!
    page: Int!
    pageSize: Int!
  }

  type TaskAnalytics {
    todoCount: Int!
    inProgressCount: Int!
    completedCount: Int!
    totalCompleted: Int!
    totalInProgress: Int!
    upcomingDeadlines: [Task!]!
  }

  type Query {
    tasks(
      filter: TaskFilterInput
      sort: TaskSortInput
      pagination: PaginationInput
    ): TaskPage! @requireAuth
    task(id: Int!): Task @requireAuth
    taskAnalytics(projectId: Int): TaskAnalytics! @requireAuth
  }

  input CreateTaskInput {
    projectId: Int!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: DateTime
    deletedAt: DateTime
  }

  input UpdateTaskInput {
    projectId: Int
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    dueDate: DateTime
    deletedAt: DateTime
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task! @requireAuth
    updateTask(id: Int!, input: UpdateTaskInput!): Task! @requireAuth
    deleteTask(id: Int!): Task! @requireAuth
  }
`
