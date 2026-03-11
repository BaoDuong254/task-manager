import { Delete, Pencil } from 'lucide-react'

import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Card, CardContent } from 'src/components/ui/card'
import type { BoardTask, TaskPriority } from 'src/types/task.type'

const priorityColorClass: Record<TaskPriority, string> = {
  LOW: 'tw-border-transparent tw-bg-blue-100 tw-text-blue-700 dark:tw-bg-blue-900 dark:tw-text-blue-300',
  MEDIUM:
    'tw-border-transparent tw-bg-yellow-100 tw-text-yellow-700 dark:tw-bg-yellow-900 dark:tw-text-yellow-300',
  HIGH: 'tw-border-transparent tw-bg-red-100 tw-text-red-700 dark:tw-bg-red-900 dark:tw-text-red-300',
}

type TaskCardProps = {
  task: BoardTask
  onEditTask?: (task: BoardTask) => void
  onDeleteTask?: (task: BoardTask) => void
}

export const TaskCard = ({ task, onEditTask, onDeleteTask }: TaskCardProps) => {
  const handleEdit = () => {
    if (onEditTask) {
      onEditTask(task)
    }
  }

  const handleDelete = () => {
    if (onDeleteTask) {
      onDeleteTask(task)
    }
  }

  const priorityLabel = `${task.priority.toLowerCase()} priority`

  return (
    <Card className="tw-group tw-bg-muted/40 tw-transition hover:tw-border-primary/60 hover:tw-bg-card">
      <CardContent className="tw-space-y-1 tw-p-3 tw-pt-3">
        <header className="tw-flex tw-items-start tw-justify-between tw-gap-2">
          <h3 className="tw-line-clamp-2 tw-text-sm tw-font-medium tw-text-foreground">
            {task.title}
          </h3>
          {(onEditTask || onDeleteTask) && (
            <div className="tw-invisible tw-flex tw-gap-1 group-hover:tw-visible">
              {onEditTask && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="tw-h-6 tw-w-6 tw-text-xs"
                  onClick={handleEdit}
                  aria-label="Edit task"
                >
                  <Pencil />
                </Button>
              )}
              {onDeleteTask && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="tw-h-6 tw-w-6 tw-text-xs tw-text-destructive"
                  onClick={handleDelete}
                  aria-label="Delete task"
                >
                  <Delete />
                </Button>
              )}
            </div>
          )}
        </header>

        {task.description && (
          <p className="tw-line-clamp-3 tw-text-xs tw-text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className="tw-flex tw-items-center tw-justify-between tw-pt-1">
          <Badge
            className={`tw-px-2 tw-py-0.5 tw-text-[10px] tw-uppercase tw-tracking-wide ${priorityColorClass[task.priority]}`}
          >
            {priorityLabel}
          </Badge>
          {task.dueDate && (
            <span className="tw-text-[10px] tw-text-muted-foreground">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
