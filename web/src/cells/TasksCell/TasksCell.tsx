import { useState } from 'react'

import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

import { TaskBoard } from 'src/components/TaskBoard'
import { TaskFormDialog } from 'src/components/TaskFormDialog'
import type { BoardTask, TaskStatus } from 'src/types/task.type'

export const QUERY = gql`
  query TasksCellQuery(
    $filter: TaskFilterInput
    $sort: TaskSortInput
    $pagination: PaginationInput
  ) {
    tasks(filter: $filter, sort: $sort, pagination: $pagination) {
      results {
        id
        projectId
        title
        description
        status
        priority
        dueDate
        createdAt
        updatedAt
      }
      totalCount
      page
      pageSize
    }
  }
`

export const beforeQuery = (variables: Record<string, unknown>) => {
  return {
    variables,
  }
}

export const Loading = () => (
  <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4 tw-text-sm tw-text-muted-foreground">
    Loading tasks...
  </div>
)

export const Empty = () => (
  <div className="tw-rounded-lg tw-border tw-border-dashed tw-border-border tw-bg-muted/40 tw-p-6 tw-text-center tw-text-sm tw-text-muted-foreground">
    No tasks found. Try adjusting your filters or creating a new task.
  </div>
)

type SuccessProps = CellSuccessProps<{
  tasks: {
    results: Array<{
      id: number
      projectId: number
      title: string
      description?: string | null
      status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      dueDate?: string | null
      createdAt: string
      updatedAt: string
    }>
    totalCount: number
    page: number
    pageSize: number
  }
}>

export const Success = ({ tasks, queryResult }: SuccessProps) => {
  const { results, totalCount, page, pageSize } = tasks

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  const boardTasks: BoardTask[] = results.map((t) => ({
    id: t.id,
    projectId: t.projectId,
    title: t.title,
    description: t.description ?? null,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ?? null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }))

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO')
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null)

  const openCreate = (status: TaskStatus) => {
    setDialogMode('create')
    setEditingTask(null)
    setDefaultStatus(status)
    setDialogOpen(true)
  }

  const openEdit = (task: BoardTask) => {
    setDialogMode('edit')
    setEditingTask(task)
    setDefaultStatus(task.status)
    setDialogOpen(true)
  }

  const refetchBoard = async () => {
    await queryResult?.refetch?.()
  }

  return (
    <section className="tw-space-y-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-muted-foreground">
        <span>
          Showing {results.length ? from : 0}–{results.length ? to : 0} of{' '}
          {totalCount} tasks
        </span>
      </div>

      <TaskBoard
        tasks={boardTasks}
        onAddTask={openCreate}
        onEditTask={openEdit}
      />

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
        onSaved={refetchBoard}
      />
    </section>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-lg tw-border tw-border-destructive/40 tw-bg-destructive/5 tw-p-4 tw-text-sm tw-text-destructive">
    Error loading tasks: {error.message}
  </div>
)
