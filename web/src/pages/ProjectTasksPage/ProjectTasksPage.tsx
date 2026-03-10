import { useState } from 'react'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import TaskAnalyticsCell from 'src/cells/TaskAnalyticsCell'
import TasksCell from 'src/cells/TasksCell'
import { PaginationControls } from 'src/components/PaginationControls'
import { TaskFilters } from 'src/components/TaskFilters'
import { TaskFormDialog } from 'src/components/TaskFormDialog'
import { Button } from 'src/components/ui/button'
import type {
  SortDirection,
  TaskFilterPriority,
  TaskFilterStatus,
  TaskSortField,
} from 'src/types/task.type'

const PROJECT_QUERY = gql`
  query ProjectTasksPageProjectQuery($id: Int!) {
    project(id: $id) {
      id
      name
      description
    }
  }
`

const ProjectTasksPage = () => {
  const params = useParams()
  const projectId = Number(params.id)

  const [status, setStatus] = useState<TaskFilterStatus>('ALL')
  const [priority, setPriority] = useState<TaskFilterPriority>('ALL')
  const [sortField, setSortField] = useState<TaskSortField>('DEADLINE')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const { data: projectData } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId },
    skip: Number.isNaN(projectId),
  })

  const projectName = projectData?.project?.name ?? 'Project'

  const filter: Record<string, unknown> = {
    status: status === 'ALL' ? null : status,
    priority:
      priority === 'ALL'
        ? null
        : priority === 'HIGH_PRIORITY'
          ? 'HIGH'
          : priority,
    projectId,
  }

  const sort: Record<string, unknown> = {
    field: sortField,
    direction: sortDirection,
  }

  const pagination = {
    page,
    pageSize,
  }

  return (
    <>
      <Metadata title={projectName} description="Project tasks" />

      <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-gap-2">
        <div>
          <h1 className="tw-text-xl tw-font-semibold tw-text-foreground">
            {projectName}
          </h1>
          {projectData?.project?.description && (
            <p className="tw-text-sm tw-text-muted-foreground">
              {projectData.project.description}
            </p>
          )}
        </div>
        <Button type="button" onClick={() => setTaskDialogOpen(true)}>
          Add New Task
        </Button>
      </div>

      <div className="tw-space-y-4">
        <TaskAnalyticsCell projectId={projectId} />

        <TaskFilters
          status={status}
          priority={priority}
          sortField={sortField}
          sortDirection={sortDirection}
          projectId={projectId}
          onStatusChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
          onPriorityChange={(value) => {
            setPriority(value)
            setPage(1)
          }}
          onSortFieldChange={(value) => {
            setSortField(value)
            setPage(1)
          }}
          onSortDirectionChange={(value) => {
            setSortDirection(value)
            setPage(1)
          }}
        />

        <TasksCell filter={filter} sort={sort} pagination={pagination} />

        <PaginationControls
          page={page}
          pageSize={pageSize}
          totalCount={0}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value)
            setPage(1)
          }}
        />
      </div>

      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        mode="create"
        defaultProjectId={projectId}
      />
    </>
  )
}

export default ProjectTasksPage
