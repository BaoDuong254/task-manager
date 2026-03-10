import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

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

export const Success = ({ tasks }: SuccessProps) => {
  const { results, totalCount, page, pageSize } = tasks

  const groupedByStatus = {
    TODO: [] as SuccessProps['tasks']['results'],
    IN_PROGRESS: [] as SuccessProps['tasks']['results'],
    COMPLETED: [] as SuccessProps['tasks']['results'],
  }

  for (const task of results) {
    groupedByStatus[task.status].push(task)
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  return (
    <section className="tw-space-y-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-muted-foreground">
        <span>
          Showing {results.length ? from : 0}–{results.length ? to : 0} of{' '}
          {totalCount} tasks
        </span>
      </div>

      <div className="tw-grid tw-gap-4 md:tw-grid-cols-3">
        {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => {
          const columnTasks = groupedByStatus[status]

          const title =
            status === 'TODO'
              ? 'Todo'
              : status === 'IN_PROGRESS'
                ? 'In Progress'
                : 'Completed'

          return (
            <div
              key={status}
              className="tw-flex tw-h-full tw-flex-col tw-rounded-lg tw-border tw-border-border tw-bg-background"
            >
              <header className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-border tw-px-3 tw-py-2">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-text-sm tw-font-semibold tw-text-foreground">
                    {title}
                  </span>
                  <span className="tw-rounded-full tw-bg-muted tw-px-2 tw-py-0.5 tw-text-xs tw-text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>
              </header>

              <div className="tw-flex-1 tw-space-y-2 tw-overflow-y-auto tw-p-3">
                {columnTasks.length === 0 ? (
                  <p className="tw-text-xs tw-text-muted-foreground">
                    No tasks in this column yet.
                  </p>
                ) : (
                  columnTasks.map((task) => (
                    <article
                      key={task.id}
                      className="tw-space-y-1 tw-rounded-md tw-border tw-border-border tw-bg-muted/40 tw-p-3"
                    >
                      <h3 className="tw-text-sm tw-font-medium tw-text-foreground">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="tw-line-clamp-2 tw-text-xs tw-text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="tw-flex tw-items-center tw-justify-between tw-pt-1">
                        <span className="tw-rounded-full tw-bg-secondary tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-medium tw-uppercase tw-tracking-wide tw-text-secondary-foreground">
                          {task.priority.toLowerCase()} priority
                        </span>
                        {task.dueDate && (
                          <span className="tw-text-[10px] tw-text-muted-foreground">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-lg tw-border tw-border-destructive/40 tw-bg-destructive/5 tw-p-4 tw-text-sm tw-text-destructive">
    Error loading tasks: {error.message}
  </div>
)
