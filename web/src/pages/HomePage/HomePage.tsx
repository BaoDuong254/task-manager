import { useState } from 'react'

import { Metadata, useQuery } from '@redwoodjs/web'

import TaskAnalyticsCell from 'src/cells/TaskAnalyticsCell'
import TasksCell from 'src/cells/TasksCell'
import UserOverviewCell from 'src/cells/UserOverviewCell'
import { PaginationControls } from 'src/components/PaginationControls'
import { TaskFilters } from 'src/components/TaskFilters'
import { Button } from 'src/components/ui/button'
import type {
  SortDirection,
  TaskFilterPriority,
  TaskFilterStatus,
  TaskSortField,
} from 'src/types/task.type'

const WORKSPACE_QUERY = gql`
  query HomePageWorkspaceQuery {
    projects {
      id
    }
    tasks(pagination: { page: 1, pageSize: 1 }) {
      totalCount
    }
  }
`

const HomePage = () => {
  const [status, setStatus] = useState<TaskFilterStatus>('ALL')
  const [priority, setPriority] = useState<TaskFilterPriority>('ALL')
  const [sortField, setSortField] = useState<TaskSortField>('DEADLINE')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: workspaceData, loading: workspaceLoading } =
    useQuery(WORKSPACE_QUERY)

  const projectCount = workspaceData?.projects.length ?? 0
  const taskCount = workspaceData?.tasks.totalCount ?? 0
  const showWelcome = !workspaceLoading && projectCount === 0 && taskCount === 0

  const filter: Record<string, unknown> = {
    status: status === 'ALL' ? null : status,
    priority:
      priority === 'ALL'
        ? null
        : priority === 'HIGH_PRIORITY'
          ? 'HIGH'
          : priority,
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
      <Metadata title="My Tasks" description="Personal task board" />

      {workspaceLoading ? (
        <div className="tw-h-40 tw-animate-pulse tw-rounded-lg tw-border tw-border-border tw-bg-muted/60" />
      ) : showWelcome ? (
        <section className="tw-flex tw-min-h-[60vh] tw-flex-col tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-dashed tw-border-border tw-bg-muted/40 tw-p-8 tw-text-center">
          <div className="tw-mb-4 tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary/10 tw-text-3xl">
            📌
          </div>
          <h1 className="tw-text-2xl tw-font-semibold tw-text-foreground">
            Welcome to your Task Manager
          </h1>
          <p className="tw-mt-2 tw-max-w-md tw-text-sm tw-text-muted-foreground">
            Get started by creating your first project. Projects help you group
            related tasks and keep your work organized.
          </p>
          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-justify-center tw-gap-3">
            <Button type="button">Create your first project</Button>
          </div>
        </section>
      ) : (
        <section className="tw-space-y-4">
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
            <div>
              <h1 className="tw-text-xl tw-font-semibold tw-text-foreground">
                My Tasks
              </h1>
              <p className="tw-text-sm tw-text-muted-foreground">
                Overview of all tasks across your projects.
              </p>
            </div>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-6">
            <UserOverviewCell taskFilter={filter} />

            <TaskAnalyticsCell />

            <TaskFilters
              status={status}
              priority={priority}
              sortField={sortField}
              sortDirection={sortDirection}
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
              totalCount={taskCount}
              onPageChange={setPage}
              onPageSizeChange={(value) => {
                setPageSize(value)
                setPage(1)
              }}
            />
          </div>
        </section>
      )}
    </>
  )
}

export default HomePage
