import { useState } from 'react'

import { Delete } from 'lucide-react'
import type {
  ProjectsCellQuery,
  ProjectsCellQueryVariables,
} from 'types/graphql'

import { Link, navigate, routes, useParams } from '@redwoodjs/router'
import {
  useMutation,
  type CellFailureProps,
  type CellSuccessProps,
} from '@redwoodjs/web'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
import { Button } from 'src/components/ui/button'

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

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProjectMutation($id: Int!) {
    deleteProject(id: $id) {
      id
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

export const Success = ({
  projects,
}: CellSuccessProps<ProjectsCellQuery, ProjectsCellQueryVariables>) => {
  const params = useParams()
  const activeProjectId = params.id ? Number(params.id) : null

  const [projectToDelete, setProjectToDelete] = useState<{
    id: number
    name: string
  } | null>(null)

  const [deleteProject, { loading: deleting }] = useMutation(
    DELETE_PROJECT_MUTATION,
    {
      refetchQueries: [
        'ProjectsCellQuery',
        'TasksCellQuery',
        'HomePageWorkspaceQuery',
      ],
    }
  )

  const handleConfirmDelete = async () => {
    if (!projectToDelete?.id || deleting) return

    await deleteProject({
      variables: { id: projectToDelete.id },
    })

    const remaining = projects.filter((p) => p.id !== projectToDelete.id)
    setProjectToDelete(null)

    if (remaining.length === 0) {
      navigate(routes.home())
    } else if (activeProjectId === projectToDelete.id) {
      navigate(routes.home())
    }
  }

  return (
    <>
      <ul className="tw-space-y-1 tw-text-sm tw-text-muted-foreground">
        {projects.map((project) => (
          <li key={project.id}>
            <div className="tw-flex tw-items-center tw-gap-1">
              <Link
                to={routes.projectTasks({ id: project.id })}
                className={`tw-flex-1 tw-rounded-md tw-px-3 tw-py-2 tw-transition-colors ${
                  activeProjectId === project.id
                    ? 'tw-bg-primary/10 tw-text-foreground'
                    : 'tw-bg-background tw-text-muted-foreground hover:tw-bg-muted/80 hover:tw-text-foreground'
                }`}
              >
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                  <span className="tw-truncate">{project.name}</span>
                </div>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="tw-h-7 tw-w-7 tw-text-destructive"
                onClick={() =>
                  setProjectToDelete({ id: project.id, name: project.name })
                }
              >
                <span aria-hidden="true">
                  <Delete />
                </span>
                <span className="tw-sr-only">Delete project</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProjectToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToDelete
                ? `Are you sure you want to delete "${projectToDelete.name}" and all of its tasks? This action cannot be undone.`
                : 'Are you sure you want to delete this project? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                Delete project
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
    Error loading projects: {error.message}
  </div>
)
