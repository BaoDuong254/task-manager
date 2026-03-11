import { Plus } from 'lucide-react'

import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader } from 'src/components/ui/card'
import type { BoardTask, TaskStatus } from 'src/types/task.type'

import { TaskCard } from './TaskCard'

const statusColorClass: Record<TaskStatus, string> = {
  TODO: 'tw-border-gray-300 dark:tw-border-gray-600',
  IN_PROGRESS: 'tw-border-blue-400 dark:tw-border-blue-500',
  COMPLETED: 'tw-border-green-400 dark:tw-border-green-500',
}

const statusBadgeColorClass: Record<TaskStatus, string> = {
  TODO: 'tw-border-transparent tw-bg-gray-100 tw-text-gray-700 dark:tw-bg-gray-800 dark:tw-text-gray-300',
  IN_PROGRESS:
    'tw-border-transparent tw-bg-blue-100 tw-text-blue-700 dark:tw-bg-blue-900 dark:tw-text-blue-300',
  COMPLETED:
    'tw-border-transparent tw-bg-green-100 tw-text-green-700 dark:tw-bg-green-900 dark:tw-text-green-300',
}

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
    <Card
      className={`tw-flex tw-h-full tw-max-h-[calc(100vh-16rem)] tw-min-h-0 tw-flex-col tw-border-t-2 ${statusColorClass[status]}`}
    >
      <CardHeader className="!tw-flex-row tw-items-center tw-justify-between tw-gap-2 tw-space-y-0 tw-border-b tw-border-border tw-px-3 tw-py-2">
        <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2">
          <span className="tw-truncate tw-text-sm tw-font-semibold tw-text-foreground">
            {title}
          </span>
          <Badge className={`tw-font-normal ${statusBadgeColorClass[status]}`}>
            {tasks.length}
          </Badge>
        </div>
        {onAddTask && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="tw-h-7 tw-w-7 tw-shrink-0 tw-text-lg"
            onClick={handleAdd}
            aria-label={`Add task to ${title}`}
          >
            <Plus />
          </Button>
        )}
      </CardHeader>

      <CardContent className="tw-min-h-0 tw-flex-1 tw-space-y-3 tw-overflow-y-auto tw-p-3 tw-pt-4">
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
      </CardContent>
    </Card>
  )
}

export default TaskColumn
