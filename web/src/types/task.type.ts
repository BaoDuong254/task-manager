export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type SortDirection = 'ASC' | 'DESC'

export type TaskSortField = 'DEADLINE' | 'PRIORITY' | 'CREATED_AT'

export type TaskFilterStatus = TaskStatus | 'ALL'

export type TaskFilterPriority = TaskPriority | 'ALL' | 'HIGH_PRIORITY'

export interface BoardTask {
  id: number
  projectId?: number
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt?: string
  updatedAt?: string
}
