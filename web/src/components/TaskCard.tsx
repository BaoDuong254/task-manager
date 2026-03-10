import { Button } from 'src/components/ui/button'
import type { BoardTask } from 'src/types/task.type'

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
    <article className="tw-group tw-space-y-1 tw-rounded-md tw-border tw-border-border tw-bg-muted/40 tw-p-3 tw-transition hover:tw-border-primary/60 hover:tw-bg-background">
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
                ✎
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
                ⌫
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
        <span className="tw-rounded-full tw-bg-secondary tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-medium tw-uppercase tw-tracking-wide tw-text-secondary-foreground">
          {priorityLabel}
        </span>
        {task.dueDate && (
          <span className="tw-text-[10px] tw-text-muted-foreground">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="tw-mt-2 tw-h-1.5 tw-overflow-hidden tw-rounded-full tw-bg-muted">
        <div className="tw-h-full tw-w-1/2 tw-rounded-full tw-bg-primary/70" />
      </div>
    </article>
  )
}

export default TaskCard
