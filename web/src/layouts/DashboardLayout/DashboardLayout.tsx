import { useEffect, useState } from 'react'

import { LayoutDashboard, LogOut, Settings } from 'lucide-react'

import { Link, routes, useMatch } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import avt from 'src/assets/avt.jpg'
import logo from 'src/assets/logo.png'
import { useAuth } from 'src/auth'
import ProjectsCell from 'src/cells/ProjectsCell'
import { ModeToggle } from 'src/components/ModeToggle'
import { TaskFormDialog } from 'src/components/TaskFormDialog'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { ProjectDialogContext } from 'src/contexts/ProjectDialogContext'
import { SearchContext } from 'src/contexts/SearchContext'

type DashboardLayoutProps = {
  children?: React.ReactNode
}

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
    }
  }
`

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, logOut } = useAuth()
  const matchHome = useMatch(routes.home())
  const matchSettings = useMatch(routes.settings())
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectError, setProjectError] = useState<string | null>(null)

  const [createProject, { loading: creatingProject }] = useMutation(
    CREATE_PROJECT_MUTATION,
    {
      onError: (error) => setProjectError(error.message),
      refetchQueries: ['ProjectsCellQuery'],
    }
  )

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false)
    await logOut()
  }

  const handleOpenProjectDialog = () => {
    setProjectError(null)
    setProjectName('')
    setProjectDescription('')
    setProjectDialogOpen(true)
  }

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault()
    setProjectError(null)

    const name = projectName.trim()

    if (!name) {
      setProjectError('Project name is required.')
      return
    }

    await createProject({
      variables: {
        input: {
          name,
          description: projectDescription.trim() || null,
        },
      },
    })

    setProjectDialogOpen(false)
    setProjectName('')
    setProjectDescription('')
  }

  return (
    <div className="tw-flex tw-h-screen tw-flex-col tw-overflow-hidden tw-bg-background">
      <header className="tw-flex tw-shrink-0 tw-items-center tw-justify-between tw-border-b tw-border-border tw-bg-background tw-px-6 tw-py-4">
        <div className="tw-flex tw-items-center tw-gap-3">
          <img src={logo} alt="Task Manager Logo" className="tw-h-8 tw-w-8" />
          <div className="tw-flex tw-flex-col">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
            />
          </div>

          <ModeToggle />
        </div>
      </header>

      <div className="tw-flex tw-flex-1 tw-overflow-hidden">
        <aside className="tw-flex tw-w-64 tw-shrink-0 tw-flex-col tw-border-r tw-border-border tw-bg-muted/40">
          <div className="tw-flex-1 tw-space-y-6 tw-overflow-y-auto tw-px-4 tw-py-6">
            <nav className="tw-space-y-1">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                Main
              </div>
              <Link
                to={routes.home()}
                className={`tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-background hover:tw-text-foreground ${matchHome.match ? 'tw-bg-background tw-font-medium tw-text-foreground' : 'tw-text-muted-foreground'}`}
              >
                <span className="tw-flex tw-items-center tw-gap-2">
                  <LayoutDashboard size={16} /> My Tasks
                </span>
              </Link>
            </nav>

            <div className="tw-space-y-2">
              <div className="tw-flex tw-items-center tw-justify-between">
                <span className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                  Projects
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenProjectDialog}
                >
                  New
                </Button>
              </div>
              <div className="tw-space-y-1 tw-text-sm tw-text-muted-foreground">
                <ProjectsCell />
              </div>
            </div>

            <div className="tw-space-y-1">
              <div className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-muted-foreground">
                System
              </div>
              <Link
                to={routes.settings()}
                className={`tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-background hover:tw-text-foreground ${matchSettings.match ? 'tw-bg-background tw-font-medium tw-text-foreground' : 'tw-text-muted-foreground'}`}
              >
                <span className="tw-flex tw-items-center tw-gap-2">
                  <Settings size={16} />
                  Settings
                </span>
              </Link>
            </div>
          </div>

          <div className="tw-border-t tw-border-border tw-px-4 tw-py-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
              <img
                src={avt}
                alt="User Avatar"
                className="tw-h-10 tw-w-10 tw-rounded-full"
              />
              <div className="tw-flex tw-flex-col tw-overflow-hidden">
                <span className="tw-truncate tw-text-sm tw-font-medium tw-text-foreground">
                  {(currentUser?.username as string) ?? 'User'}
                </span>
                <span className="tw-truncate tw-text-xs tw-text-muted-foreground">
                  {(currentUser?.email as string) ?? 'Welcome back'}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowLogoutConfirm(true)}
                aria-label="Logout"
              >
                <span aria-hidden="true">
                  <LogOut />
                </span>
              </Button>
            </div>
          </div>
        </aside>

        <main className="tw-flex-1 tw-overflow-hidden tw-bg-muted/10 tw-px-4 tw-py-4 md:tw-px-8 md:tw-py-6">
          <SearchContext.Provider
            value={{ search, setSearch, debouncedSearch }}
          >
            <ProjectDialogContext.Provider
              value={{ openProjectDialog: handleOpenProjectDialog }}
            >
              {children}
            </ProjectDialogContext.Provider>
          </SearchContext.Provider>
        </main>
      </div>

      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        mode="create"
      />

      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="tw-p-0">
          <DialogHeader className="tw-border-b tw-border-border tw-px-5 tw-py-4 tw-text-left">
            <DialogTitle className="tw-text-sm">Create Project</DialogTitle>
            <DialogDescription className="tw-mt-1 tw-text-xs">
              Give your project a short, descriptive name.
            </DialogDescription>
          </DialogHeader>

          <form
            className="tw-space-y-3 tw-px-5 tw-py-4"
            onSubmit={handleCreateProject}
          >
            {projectError && (
              <div className="tw-rounded-md tw-bg-destructive/5 tw-px-3 tw-py-2 tw-text-xs tw-text-destructive">
                {projectError}
              </div>
            )}

            <label className="tw-grid tw-gap-1">
              <span className="tw-text-xs tw-font-medium tw-text-foreground">
                Project Name
              </span>
              <input
                className="tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                placeholder="e.g. Marketing Website"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                disabled={creatingProject}
              />
            </label>

            <label className="tw-grid tw-gap-1">
              <span className="tw-text-xs tw-font-medium tw-text-foreground">
                Description
              </span>
              <textarea
                className="tw-min-h-[80px] tw-w-full tw-resize-y tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-text-foreground placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background"
                placeholder="Optional details..."
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                disabled={creatingProject}
              />
            </label>

            <DialogFooter className="tw-border-t tw-border-border tw-pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setProjectDialogOpen(false)}
                disabled={creatingProject}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={creatingProject}>
                {creatingProject ? 'Creating…' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your workspace.
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
                onClick={handleConfirmLogout}
              >
                Logout
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DashboardLayout
