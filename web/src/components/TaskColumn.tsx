import { Button } from 'src/components/ui/button'
import type { BoardTask, TaskStatus } from 'src/types/task.type'

import { TaskCard } from './TaskCard'

type TaskColumnProps = {
  title: string
  status: TaskStatus
  tasks: BoardTask[]
  onAddTask?: (status: TaskStatus) => void
  onEditTask?: (task: BoardTask) => void
  onDeleteTask?: (task: BoardTask) => void
}

export const TaskColumn = ({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskColumnProps) => {
  const handleAdd = () => {
    if (onAddTask) {
      onAddTask(status)
    }
  }

  return (
    <section className="tw-flex tw-h-full tw-flex-col tw-rounded-lg tw-border tw-border-border tw-bg-background">
      <header className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-border tw-px-3 tw-py-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <span className="tw-text-sm tw-font-semibold tw-text-foreground">
            {title}
          </span>
          <span className="tw-rounded-full tw-bg-muted tw-px-2 tw-py-0.5 tw-text-xs tw-text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="tw-h-7 tw-w-7 tw-text-lg"
            onClick={handleAdd}
            aria-label={`Add task to ${title}`}
          >
            +
          </Button>
        )}
      </header>

      <div className="tw-flex-1 tw-space-y-2 tw-overflow-y-auto tw-p-3">
        {tasks.length === 0 ? (
          <p className="tw-text-xs tw-text-muted-foreground">
            No tasks in this column yet.
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default TaskColumn
