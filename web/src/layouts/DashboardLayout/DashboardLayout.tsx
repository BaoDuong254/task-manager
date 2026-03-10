import type { ReactNode } from 'react'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'

type DashboardLayoutProps = {
  children?: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, logOut } = useAuth()

  const handleLogout = async () => {
    await logOut()
  }

  return (
    <div className="tw-flex tw-min-h-screen tw-flex-col tw-bg-background">
      <header className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-border tw-bg-background tw-px-6 tw-py-4">
        <div className="tw-flex tw-items-center tw-gap-3">
          <div className="tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary/10 tw-text-lg tw-font-semibold tw-text-primary">
            TM
          </div>
          <div className="tw-flex tw-flex-col">
            <span className="tw-text-sm tw-font-medium tw-text-muted-foreground">
              EVOCs
            </span>
            <span className="tw-text-lg tw-font-semibold tw-text-foreground">
              Task Manager
            </span>
          </div>
        </div>

        <div className="tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-4 tw-pl-6">
          <div className="tw-relative tw-hidden tw-max-w-md tw-flex-1 md:tw-block">
            <input
              type="search"
              placeholder="Search tasks, projects..."
              className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Notifications"
          >
            <span className="tw-text-lg" aria-hidden="true">
              ⏰
            </span>
          </Button>

          <Button type="button" className="tw-hidden md:tw-inline-flex">
            Add New Task
          </Button>
        </div>
      </header>

      <div className="tw-flex tw-flex-1 tw-overflow-hidden">
        <aside className="tw-flex tw-w-64 tw-flex-col tw-border-r tw-border-border tw-bg-muted/40">
          <div className="tw-flex-1 tw-space-y-6 tw-overflow-y-auto tw-px-4 tw-py-6">
            <nav className="tw-space-y-1">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                Main
              </div>
              <button className="tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-text-foreground tw-shadow-sm">
                <span>My Tasks</span>
              </button>
            </nav>

            <div className="tw-space-y-2">
              <div className="tw-flex tw-items-center tw-justify-between">
                <span className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                  Projects
                </span>
                <Button type="button" size="sm" variant="outline">
                  New
                </Button>
              </div>
              <div className="tw-space-y-1 tw-text-sm tw-text-muted-foreground">
                <div className="tw-rounded-md tw-bg-background tw-px-3 tw-py-2">
                  Project list coming soon
                </div>
              </div>
            </div>

            <div className="tw-space-y-1">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                System
              </div>
              <button className="tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-3 tw-py-2 tw-text-sm tw-text-muted-foreground hover:tw-bg-background hover:tw-text-foreground">
                <span>Settings</span>
              </button>
            </div>
          </div>

          <div className="tw-border-t tw-border-border tw-px-4 tw-py-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
              <div className="tw-flex tw-flex-col tw-overflow-hidden">
                <span className="tw-truncate tw-text-sm tw-font-medium tw-text-foreground">
                  {(currentUser?.email as string) ?? 'Logged in user'}
                </span>
                <span className="tw-truncate tw-text-xs tw-text-muted-foreground">
                  {currentUser?.id ? `ID: ${currentUser.id}` : 'Welcome back'}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <span aria-hidden="true">⎋</span>
              </Button>
            </div>
          </div>
        </aside>

        <main className="tw-flex-1 tw-overflow-y-auto tw-bg-muted/10 tw-px-4 tw-py-4 md:tw-px-8 md:tw-py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
