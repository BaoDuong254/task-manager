import { Button } from 'src/components/ui/button'

type PaginationControlsProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export const PaginationControls = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handlePrevious = () => {
    if (page > 1 && onPageChange) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages && onPageChange) {
      onPageChange(page + 1)
    }
  }

  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount)

  return (
    <div className="text-xs tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-3 tw-rounded-lg tw-border tw-border-border tw-bg-background tw-px-3 tw-py-2 md:tw-flex-row md:tw-items-center">
      <div className="tw-text-muted-foreground">
        Showing {from}–{to} of {totalCount} results
      </div>

      <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
        <div className="tw-flex tw-items-center tw-gap-1">
          <span className="tw-text-xs tw-text-muted-foreground">
            Rows per page
          </span>
          <select
            className="tw-h-8 tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-2 tw-text-xs tw-text-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handlePrevious}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleNext}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaginationControls
