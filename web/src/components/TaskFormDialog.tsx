import { useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import type { BoardTask, TaskPriority, TaskStatus } from 'src/types/task.type'

const PROJECTS_QUERY = gql`
  query TaskFormProjectsQuery {
    projects {
      id
      name
    }
  }
`

const CREATE_TASK_MUTATION = gql`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      updatedAt
    }
  }
`

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTaskMutation($id: Int!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      updatedAt
    }
  }
`

type ProjectOption = { id: number; name: string }

export type TaskFormDialogMode = 'create' | 'edit'

type TaskFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: TaskFormDialogMode
  initialTask?: BoardTask | null
  defaultStatus?: TaskStatus
  defaultProjectId?: number
  onSaved?: () => void | Promise<void>
}

function toDateInputValue(dateTime?: string | null) {
  if (!dateTime) return ''
  const d = new Date(dateTime)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function toDateTimeOrNull(dateInput: string) {
  if (!dateInput) return null
  const d = new Date(`${dateInput}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export const TaskFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialTask,
  defaultStatus,
  defaultProjectId,
  onSaved,
}: TaskFormDialogProps) => {
  const {
    data,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery<{
    projects: ProjectOption[]
  }>(PROJECTS_QUERY)

  const projects = useMemo(() => data?.projects ?? [], [data])
  const hasProjects = projects.length > 0

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [projectId, setProjectId] = useState<number | ''>('')
  const [dueDate, setDueDate] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const dialogTitle = mode === 'edit' ? 'Edit Task' : 'Add New Task'

  const initialProjectId = useMemo(() => {
    if (mode === 'edit' && initialTask?.projectId) return initialTask.projectId
    if (defaultProjectId) return defaultProjectId
    return projects[0]?.id
  }, [defaultProjectId, initialTask?.projectId, mode, projects])

  useEffect(() => {
    if (!open) return
    setFormError(null)

    if (mode === 'edit' && initialTask) {
      setTitle(initialTask.title ?? '')
      setDescription(initialTask.description ?? '')
      setStatus(initialTask.status)
      setPriority(initialTask.priority)
      setDueDate(toDateInputValue(initialTask.dueDate))
      setProjectId(initialTask.projectId ?? initialProjectId ?? '')
      return
    }

    setTitle('')
    setDescription('')
    setStatus(defaultStatus ?? 'TODO')
    setPriority('MEDIUM')
    setDueDate('')
    setProjectId(initialProjectId ?? '')
  }, [defaultStatus, initialProjectId, initialTask, mode, open])

  const [createTask, { loading: createLoading }] = useMutation(
    CREATE_TASK_MUTATION,
    {
      onError: (e) => setFormError(e.message),
    }
  )

  const [updateTask, { loading: updateLoading }] = useMutation(
    UPDATE_TASK_MUTATION,
    {
      onError: (e) => setFormError(e.message),
    }
  )

  const saving = createLoading || updateLoading

  const close = () => onOpenChange(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('Task title is required.')
      return
    }

    if (!hasProjects) {
      setFormError('You need to create a project before you can create tasks.')
      return
    }

    if (!projectId) {
      setFormError('Please select a project.')
      return
    }

    const dueDateValue = toDateTimeOrNull(dueDate)

    if (mode === 'create') {
      await createTask({
        variables: {
          input: {
            title: trimmedTitle,
            description: description.trim() || null,
            status,
            priority,
            projectId: Number(projectId),
            dueDate: dueDateValue,
          },
        },
      })
    } else {
      if (!initialTask?.id) {
        setFormError('Missing task id.')
        return
      }

      await updateTask({
        variables: {
          id: initialTask.id,
          input: {
            title: trimmedTitle,
            description: description.trim() || null,
            status,
            priority,
            projectId: Number(projectId),
            dueDate: dueDateValue,
          },
        },
      })
    }

    if (onSaved) {
      await onSaved()
    }

    close()
  }

  if (!open) return null

  return (
    <div
      className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/40 tw-p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className="tw-relative tw-w-full tw-max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-label={dialogTitle}
      >
        <div className="tw-w-full tw-max-w-lg tw-rounded-lg tw-border tw-border-border tw-bg-background tw-shadow-lg">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-4 tw-border-b tw-border-border tw-px-5 tw-py-4">
            <div>
              <h2 className="tw-text-base tw-font-semibold tw-text-foreground">
                {dialogTitle}
              </h2>
              <p className="tw-mt-1 tw-text-xs tw-text-muted-foreground">
                {mode === 'edit'
                  ? 'Update the details of this task.'
                  : 'Fill in the details to create a new task.'}
              </p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={close}>
              ✕
            </Button>
          </div>

          <form onSubmit={onSubmit} className="tw-space-y-4 tw-px-5 tw-py-4">
            {projectsError && (
              <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
                Error loading projects: {projectsError.message}
              </div>
            )}

            {!projectsLoading && !hasProjects && (
              <div className="tw-rounded-md tw-border tw-border-dashed tw-border-border tw-bg-muted/30 tw-px-3 tw-py-3 tw-text-sm tw-text-muted-foreground">
                You don’t have any projects yet. Create a project first, then
                come back to add tasks.
              </div>
            )}

            {formError && (
              <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
                {formError}
              </div>
            )}

            <div className="tw-grid tw-gap-3">
              <label className="tw-grid tw-gap-1">
                <span className="tw-text-xs tw-font-medium tw-text-foreground">
                  Task Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                  placeholder="e.g. Prepare sprint board"
                  disabled={saving}
                />
              </label>

              <label className="tw-grid tw-gap-1">
                <span className="tw-text-xs tw-font-medium tw-text-foreground">
                  Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="tw-min-h-[90px] tw-w-full tw-resize-y tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                  placeholder="Optional details..."
                  disabled={saving}
                />
              </label>

              <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2">
                <label className="tw-grid tw-gap-1">
                  <span className="tw-text-xs tw-font-medium tw-text-foreground">
                    Project
                  </span>
                  <select
                    value={projectId}
                    onChange={(e) =>
                      setProjectId(e.target.value ? Number(e.target.value) : '')
                    }
                    className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                    disabled={saving || projectsLoading || !hasProjects}
                  >
                    <option value="">
                      {projectsLoading ? 'Loading…' : 'Select a project'}
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="tw-grid tw-gap-1">
                  <span className="tw-text-xs tw-font-medium tw-text-foreground">
                    Due Date
                  </span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2">
                <label className="tw-grid tw-gap-1">
                  <span className="tw-text-xs tw-font-medium tw-text-foreground">
                    Status
                  </span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                    disabled={saving}
                  >
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </label>

                <label className="tw-grid tw-gap-1">
                  <span className="tw-text-xs tw-font-medium tw-text-foreground">
                    Priority
                  </span>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as TaskPriority)
                    }
                    className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                    disabled={saving}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="tw-flex tw-items-center tw-justify-end tw-gap-2 tw-border-t tw-border-border tw-pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || projectsLoading || !hasProjects}
              >
                {saving
                  ? 'Saving…'
                  : mode === 'edit'
                    ? 'Save Changes'
                    : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskFormDialog
