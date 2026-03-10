import { Button } from 'src/components/ui/button'
import type {
  TaskFilterPriority,
  TaskFilterStatus,
  TaskSortField,
  SortDirection,
} from 'src/types/task.type'

type TaskFiltersProps = {
  status: TaskFilterStatus
  priority: TaskFilterPriority
  sortField: TaskSortField
  sortDirection: SortDirection
  projectId?: number | null
  projectOptions?: Array<{ id: number; name: string }>
  onStatusChange?: (value: TaskFilterStatus) => void
  onPriorityChange?: (value: TaskFilterPriority) => void
  onSortFieldChange?: (value: TaskSortField) => void
  onSortDirectionChange?: (value: SortDirection) => void
  onProjectChange?: (value: number | null) => void
}

const statusFilters: Array<{ label: string; value: TaskFilterStatus }> = [
  { label: 'All Tasks', value: 'ALL' },
  { label: 'Todo', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
]

const priorityFilters: Array<{ label: string; value: TaskFilterPriority }> = [
  { label: 'All', value: 'ALL' },
  { label: 'High Priority', value: 'HIGH_PRIORITY' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
]

const sortFields: Array<{ label: string; value: TaskSortField }> = [
  { label: 'Deadline', value: 'DEADLINE' },
  { label: 'Priority', value: 'PRIORITY' },
  { label: 'Date Created', value: 'CREATED_AT' },
]

export const TaskFilters = ({
  status,
  priority,
  sortField,
  sortDirection,
  projectId,
  projectOptions,
  onStatusChange,
  onPriorityChange,
  onSortFieldChange,
  onSortDirectionChange,
  onProjectChange,
}: TaskFiltersProps) => {
  return (
    <section className="tw-flex tw-flex-col tw-gap-3 tw-rounded-lg tw-border tw-border-border tw-bg-background tw-p-3 md:tw-flex-row md:tw-items-center md:tw-justify-between">
      <div className="tw-flex tw-flex-wrap tw-gap-2">
        {statusFilters.map((item) => {
          const isActive = status === item.value

          return (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              className="tw-text-xs"
              onClick={() => onStatusChange?.(item.value)}
            >
              {item.label}
            </Button>
          )
        })}
      </div>

      <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
        <div className="tw-flex tw-items-center tw-gap-2">
          <span className="tw-text-xs tw-text-muted-foreground">Priority</span>
          <select
            className="tw-h-8 tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-2 tw-text-xs tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
            value={priority}
            onChange={(event) =>
              onPriorityChange?.(event.target.value as TaskFilterPriority)
            }
          >
            {priorityFilters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2">
          <span className="tw-text-xs tw-text-muted-foreground">Sort by</span>
          <select
            className="tw-h-8 tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-2 tw-text-xs tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
            value={sortField}
            onChange={(event) =>
              onSortFieldChange?.(event.target.value as TaskSortField)
            }
          >
            {sortFields.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="tw-h-8 tw-w-8 tw-text-xs"
            onClick={() =>
              onSortDirectionChange?.(sortDirection === 'ASC' ? 'DESC' : 'ASC')
            }
            aria-label={
              sortDirection === 'ASC' ? 'Sort descending' : 'Sort ascending'
            }
          >
            {sortDirection === 'ASC' ? '↑' : '↓'}
          </Button>
        </div>

        {projectOptions && projectOptions.length > 0 && (
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-xs tw-text-muted-foreground">Project</span>
            <select
              className="tw-h-8 tw-min-w-[8rem] tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-2 tw-text-xs tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
              value={projectId ?? ''}
              onChange={(event) => {
                const value = event.target.value
                onProjectChange?.(value === '' ? null : Number(value))
              }}
            >
              <option value="">All projects</option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </section>
  )
}

export default TaskFilters
