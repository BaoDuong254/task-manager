import { Badge } from 'src/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import type { BoardTask, TaskPriority } from 'src/types/task.type'

const priorityColorClass: Record<TaskPriority, string> = {
  LOW: 'tw-border-transparent tw-bg-blue-100 tw-text-blue-700 dark:tw-bg-blue-900 dark:tw-text-blue-300',
  MEDIUM:
    'tw-border-transparent tw-bg-yellow-100 tw-text-yellow-700 dark:tw-bg-yellow-900 dark:tw-text-yellow-300',
  HIGH: 'tw-border-transparent tw-bg-red-100 tw-text-red-700 dark:tw-bg-red-900 dark:tw-text-red-300',
}

type TaskAnalyticsBarProps = {
  todoCount: number
  inProgressCount: number
  completedCount: number
  totalCompleted: number
  totalInProgress: number
  upcomingDeadlines: BoardTask[]
}

export const TaskAnalyticsBar = ({
  todoCount,
  inProgressCount,
  completedCount,
  totalCompleted,
  totalInProgress,
  upcomingDeadlines,
}: TaskAnalyticsBarProps) => {
  return (
    <section className="tw-space-y-4">
      <div className="tw-grid tw-gap-3 md:tw-grid-cols-2 lg:tw-grid-cols-4">
        <Card>
          <CardContent className="tw-p-4">
            <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
              Todo Tasks
            </p>
            <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
              {todoCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="tw-p-4">
            <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
              In Progress
            </p>
            <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
              {inProgressCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="tw-p-4">
            <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
              Completed
            </p>
            <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
              {completedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="tw-p-4">
            <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
              Overall Progress
            </p>
            <div className="tw-mt-2 tw-text-xs tw-text-muted-foreground">
              <div className="tw-mb-1 tw-flex tw-justify-between">
                <span>Completed</span>
                <span className="tw-font-medium tw-text-foreground">
                  {totalCompleted}
                </span>
              </div>
              <div className="tw-flex tw-justify-between">
                <span>Active (Todo + In Progress)</span>
                <span className="tw-font-medium tw-text-foreground">
                  {totalInProgress}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-gap-2 tw-space-y-0 tw-p-4">
          <CardTitle className="tw-text-sm">Upcoming Deadlines</CardTitle>
          <span className="tw-text-xs tw-text-muted-foreground">
            Next {upcomingDeadlines.length} tasks
          </span>
        </CardHeader>
        <CardContent className="tw-p-4 tw-pt-0">
          {upcomingDeadlines.length === 0 ? (
            <p className="tw-text-xs tw-text-muted-foreground">
              No upcoming deadlines. You are all caught up!
            </p>
          ) : (
            <ul className="tw-space-y-2">
              {upcomingDeadlines.map((task) => (
                <li
                  key={task.id}
                  className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-md tw-bg-muted/60 tw-px-3 tw-py-2"
                >
                  <div className="tw-min-w-0">
                    <p className="tw-truncate tw-text-xs tw-font-medium tw-text-foreground">
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="tw-text-[10px] tw-text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={`tw-flex-shrink-0 tw-text-[10px] tw-uppercase tw-tracking-wide ${priorityColorClass[task.priority]}`}
                  >
                    {task.priority.toLowerCase()} priority
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default TaskAnalyticsBar
