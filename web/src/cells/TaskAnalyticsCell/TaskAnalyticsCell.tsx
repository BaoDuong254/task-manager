import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query TaskAnalyticsCellQuery($projectId: Int) {
    taskAnalytics(projectId: $projectId) {
      todoCount
      inProgressCount
      completedCount
      totalCompleted
      totalInProgress
      upcomingDeadlines {
        id
        title
        status
        priority
        dueDate
        projectId
      }
    }
  }
`

export const beforeQuery = (variables: Record<string, unknown>) => {
  return {
    variables,
    fetchPolicy: 'cache-and-network' as const,
  }
}

export const Loading = () => (
  <div className="tw-grid tw-gap-3 md:tw-grid-cols-2 lg:tw-grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="tw-h-24 tw-animate-pulse tw-rounded-lg tw-border tw-border-border tw-bg-muted/60"
      />
    ))}
  </div>
)

export const Empty = () => (
  <div className="tw-rounded-lg tw-border tw-border-dashed tw-border-border tw-bg-muted/40 tw-p-4 tw-text-sm tw-text-muted-foreground">
    No analytics available yet. Create a project and add some tasks to see
    insights here.
  </div>
)

type SuccessProps = CellSuccessProps<{
  taskAnalytics: {
    todoCount: number
    inProgressCount: number
    completedCount: number
    totalCompleted: number
    totalInProgress: number
    upcomingDeadlines: Array<{
      id: number
      title: string
      status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      dueDate?: string | null
      projectId: number
    }>
  }
}>

export const Success = ({ taskAnalytics }: SuccessProps) => {
  const {
    todoCount,
    inProgressCount,
    completedCount,
    totalCompleted,
    totalInProgress,
    upcomingDeadlines,
  } = taskAnalytics

  return (
    <section className="tw-space-y-4">
      <div className="tw-grid tw-gap-3 md:tw-grid-cols-2 lg:tw-grid-cols-4">
        <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
          <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
            Todo Tasks
          </p>
          <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
            {todoCount}
          </p>
        </div>

        <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
          <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
            In Progress
          </p>
          <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
            {inProgressCount}
          </p>
        </div>

        <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
          <p className="tw-text-xs tw-font-medium tw-text-muted-foreground">
            Completed
          </p>
          <p className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-foreground">
            {completedCount}
          </p>
        </div>

        <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
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
        </div>
      </div>

      <div className="tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
          <h2 className="tw-text-sm tw-font-semibold tw-text-foreground">
            Upcoming Deadlines
          </h2>
          <span className="tw-text-xs tw-text-muted-foreground">
            Next {upcomingDeadlines.length} tasks
          </span>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <p className="tw-mt-3 tw-text-xs tw-text-muted-foreground">
            No upcoming deadlines. You are all caught up!
          </p>
        ) : (
          <ul className="tw-mt-3 tw-space-y-2">
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
                <span className="tw-flex-shrink-0 tw-rounded-full tw-bg-secondary tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-medium tw-uppercase tw-tracking-wide tw-text-secondary-foreground">
                  {task.priority.toLowerCase()} priority
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-lg tw-border tw-border-destructive/40 tw-bg-destructive/5 tw-p-4 tw-text-sm tw-text-destructive">
    Error loading analytics: {error.message}
  </div>
)
