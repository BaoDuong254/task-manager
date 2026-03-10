import { Link, routes, useParams } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ProjectsCellQuery {
    projects {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => (
  <div className="tw-space-y-1">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="tw-h-8 tw-animate-pulse tw-rounded-md tw-bg-muted/60"
      />
    ))}
  </div>
)

export const Empty = () => (
  <div className="tw-rounded-md tw-bg-background tw-px-3 tw-py-2 tw-text-xs tw-text-muted-foreground">
    No projects yet. Create your first project to start organizing tasks.
  </div>
)

type SuccessProps = CellSuccessProps<{
  projects: Array<{
    id: number
    name: string
    description?: string | null
    createdAt: string
    updatedAt: string
  }>
}>

export const Success = ({ projects }: SuccessProps) => {
  const params = useParams()
  const activeProjectId = params.id ? Number(params.id) : null

  return (
    <ul className="tw-space-y-1 tw-text-sm tw-text-muted-foreground">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            to={routes.projectTasks({ id: project.id })}
            className={`tw-block tw-rounded-md tw-px-3 tw-py-2 tw-transition-colors ${
              activeProjectId === project.id
                ? 'tw-bg-primary/10 tw-text-foreground'
                : 'tw-bg-background tw-text-muted-foreground hover:tw-bg-muted/80 hover:tw-text-foreground'
            }`}
          >
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
              <span className="tw-truncate">{project.name}</span>
            </div>
            {project.description && (
              <p className="tw-truncate tw-text-xs tw-text-muted-foreground">
                {project.description}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
    Error loading projects: {error.message}
  </div>
)
