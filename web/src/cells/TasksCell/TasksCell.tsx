import { useEffect, useState } from 'react'

import type {
  TasksCellQuery,
  TasksCellQueryVariables,
  TaskFilterInput,
} from 'types/graphql'

import {
  useMutation,
  type CellFailureProps,
  type CellSuccessProps,
} from '@redwoodjs/web'

import { TaskBoard } from 'src/components/TaskBoard'
import { TaskFormDialog } from 'src/components/TaskFormDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
import { Button } from 'src/components/ui/button'
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

const DELETE_TASK_MUTATION = gql`
  mutation DeleteTaskMutation($id: Int!) {
    deleteTask(id: $id) {
      id
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

type ExtraProps = {
  filter?: TaskFilterInput
  onTotalCountChange?: (totalCount: number) => void
}

type SuccessProps = CellSuccessProps<TasksCellQuery, TasksCellQueryVariables> &
  ExtraProps

export const Success = ({
  tasks,
  queryResult,
  filter,
  onTotalCountChange,
}: SuccessProps) => {
  const { results, totalCount, page, pageSize } = tasks

  useEffect(() => {
    onTotalCountChange?.(totalCount)
  }, [totalCount, onTotalCountChange])

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

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK_MUTATION)
  const [taskToDelete, setTaskToDelete] = useState<BoardTask | null>(null)

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

  const requestDelete = (task: BoardTask) => {
    if (!task.id || deleting) {
      return
    }
    setTaskToDelete(task)
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete?.id || deleting) {
      return
    }

    await deleteTask({
      variables: {
        id: taskToDelete.id,
      },
      refetchQueries: [
        'TasksCellQuery',
        'TaskAnalyticsCellQuery',
        'HomePageWorkspaceQuery',
      ],
    })

    setTaskToDelete(null)
    await refetchBoard()
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
        onDeleteTask={requestDelete}
      />

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
        defaultProjectId={filter?.projectId ?? undefined}
        onSaved={refetchBoard}
      />

      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setTaskToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-lg tw-border tw-border-destructive/40 tw-bg-destructive/5 tw-p-4 tw-text-sm tw-text-destructive">
    Error loading tasks: {error.message}
  </div>
)
