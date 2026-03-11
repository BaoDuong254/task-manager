import { type FormEvent, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'
import { Textarea } from 'src/components/ui/textarea'
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
      refetchQueries: [
        'TasksCellQuery',
        'TaskAnalyticsCellQuery',
        'HomePageWorkspaceQuery',
      ],
    }
  )

  const [updateTask, { loading: updateLoading }] = useMutation(
    UPDATE_TASK_MUTATION,
    {
      onError: (e) => setFormError(e.message),
      refetchQueries: [
        'TasksCellQuery',
        'TaskAnalyticsCellQuery',
        'HomePageWorkspaceQuery',
      ],
    }
  )

  const saving = createLoading || updateLoading

  const close = () => onOpenChange(false)

  const onSubmit = async (e: FormEvent) => {
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

    if (!dueDate) {
      setFormError('Due date is required.')
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tw-p-0">
        <div className="tw-border-b tw-border-border tw-px-5 tw-py-4">
          <DialogHeader className="tw-space-y-1 tw-text-left">
            <DialogTitle className="tw-text-base">{dialogTitle}</DialogTitle>
            <DialogDescription className="tw-text-xs">
              {mode === 'edit'
                ? 'Update the details of this task.'
                : 'Fill in the details to create a new task.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit} className="tw-space-y-4 tw-px-5 tw-py-4">
          {projectsError && (
            <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
              Error loading projects: {projectsError.message}
            </div>
          )}

          {!projectsLoading && !hasProjects && (
            <div className="tw-rounded-md tw-border tw-border-dashed tw-border-border tw-bg-muted/30 tw-px-3 tw-py-3 tw-text-sm tw-text-muted-foreground">
              You don’t have any projects yet. Create a project first, then come
              back to add tasks.
            </div>
          )}

          {formError && (
            <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
              {formError}
            </div>
          )}

          <div className="tw-grid tw-gap-3">
            <div className="tw-grid tw-gap-1">
              <Label
                htmlFor="task-form-title"
                className="tw-text-xs tw-font-medium"
              >
                Task Title
              </Label>
              <Input
                id="task-form-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="tw-h-9 tw-text-sm"
                placeholder="e.g. Prepare sprint board"
                disabled={saving}
              />
            </div>

            <div className="tw-grid tw-gap-1">
              <Label
                htmlFor="task-form-description"
                className="tw-text-xs tw-font-medium"
              >
                Description
              </Label>
              <Textarea
                id="task-form-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="tw-min-h-[90px] tw-text-sm"
                placeholder="Optional details..."
                disabled={saving}
              />
            </div>

            <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2">
              <div className="tw-grid tw-gap-1">
                <Label className="tw-text-xs tw-font-medium">Project</Label>
                <Select
                  value={projectId === '' ? undefined : String(projectId)}
                  onValueChange={(value) =>
                    setProjectId(value ? Number(value) : '')
                  }
                  disabled={saving || projectsLoading || !hasProjects}
                >
                  <SelectTrigger className="tw-h-9 tw-text-sm">
                    <SelectValue
                      placeholder={
                        projectsLoading ? 'Loading…' : 'Select a project'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="tw-grid tw-gap-1">
                <Label
                  htmlFor="task-form-dueDate"
                  className="tw-text-xs tw-font-medium"
                >
                  Due Date
                </Label>
                <Input
                  id="task-form-dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="tw-h-9 tw-text-sm"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2">
              <div className="tw-grid tw-gap-1">
                <Label className="tw-text-xs tw-font-medium">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                  disabled={saving}
                >
                  <SelectTrigger className="tw-h-9 tw-text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="tw-grid tw-gap-1">
                <Label className="tw-text-xs tw-font-medium">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as TaskPriority)}
                  disabled={saving}
                >
                  <SelectTrigger className="tw-h-9 tw-text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="tw-border-t tw-border-border tw-pt-4">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskFormDialog
