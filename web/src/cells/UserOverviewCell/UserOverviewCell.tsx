import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query UserOverviewCellQuery($taskFilter: TaskFilterInput) {
    projects {
      id
    }
    tasks(filter: $taskFilter, pagination: { page: 1, pageSize: 1 }) {
      totalCount
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
  <div className="tw-h-20 tw-animate-pulse tw-rounded-lg tw-border tw-border-border tw-bg-muted/60" />
)

export const Empty = () => (
  <div className="tw-rounded-lg tw-border tw-border-dashed tw-border-border tw-bg-muted/40 tw-p-4 tw-text-sm tw-text-muted-foreground">
    Loading your overview...
  </div>
)

type SuccessProps = CellSuccessProps<{
  projects: Array<{ id: number }>
  tasks: {
    totalCount: number
  }
}>

export const Success = ({ projects, tasks }: SuccessProps) => {
  const projectCount = projects.length
  const taskCount = tasks.totalCount

  return (
    <section className="tw-flex tw-items-center tw-justify-between tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-4">
      <div>
        <p className="tw-text-xs tw-font-medium tw-uppercase tw-tracking-wide tw-text-muted-foreground">
          Workspace overview
        </p>
        <p className="tw-mt-1 tw-text-sm tw-text-foreground">
          You have{' '}
          <span className="tw-font-semibold">{projectCount} projects</span> and{' '}
          <span className="tw-font-semibold">{taskCount} tasks</span> in total.
        </p>
      </div>
    </section>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-lg tw-border tw-border-destructive/40 tw-bg-destructive/5 tw-p-4 tw-text-sm tw-text-destructive">
    Error loading overview: {error.message}
  </div>
)
