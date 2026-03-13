import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'

import { ProjectDialogContext } from 'src/contexts/ProjectDialogContext'
import { SearchContext } from 'src/contexts/SearchContext'

import HomePage from './HomePage'

const mockOpenProjectDialog = jest.fn()

const renderWithContexts = (ui: React.ReactElement) =>
  render(
    <ProjectDialogContext.Provider
      value={{ openProjectDialog: mockOpenProjectDialog }}
    >
      <SearchContext.Provider
        value={{ search: '', setSearch: jest.fn(), debouncedSearch: '' }}
      >
        {ui}
      </SearchContext.Provider>
    </ProjectDialogContext.Provider>
  )

// Mock data helpers
const emptyWorkspace = () => ({
  projects: [],
  tasks: { totalCount: 0 },
})

const populatedWorkspace = () => ({
  projects: [{ id: 1 }, { id: 2 }],
  tasks: { totalCount: 12 },
})

beforeEach(() => {
  mockCurrentUser({ id: 1, username: 'testuser', email: 'test@example.com' })
  jest.clearAllMocks()
  mockGraphQLQuery('TaskAnalyticsCellQuery', () => ({
    taskAnalytics: {
      todoCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      totalCompleted: 0,
      totalInProgress: 0,
      upcomingDeadlines: [],
    },
  }))
  mockGraphQLQuery('TasksCellQuery', () => ({
    tasks: { results: [], totalCount: 0, page: 1, pageSize: 10 },
  }))
  mockGraphQLQuery('UserOverviewCellQuery', () => ({
    projects: [],
    tasks: { totalCount: 0 },
  }))
  mockGraphQLQuery('TaskFormProjectsQuery', () => ({ projects: [] }))
})

describe('HomePage', () => {
  it('renders successfully', () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', emptyWorkspace)
    expect(() => renderWithContexts(<HomePage />)).not.toThrow()
  })

  it('shows welcome section with heading when workspace is empty', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', emptyWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByText('Welcome to your Task Manager')
      ).toBeInTheDocument()
    })
  })

  it('shows onboarding description in welcome section', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', emptyWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByText(/Get started by creating your first project/i)
      ).toBeInTheDocument()
    })
  })

  it('shows "Create your first project" button in welcome state', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', emptyWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create your first project' })
      ).toBeInTheDocument()
    })
  })

  it('calls openProjectDialog when "Create your first project" is clicked', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', emptyWorkspace)
    renderWithContexts(<HomePage />)
    const button = await screen.findByRole('button', {
      name: 'Create your first project',
    })
    fireEvent.click(button)
    expect(mockOpenProjectDialog).toHaveBeenCalledTimes(1)
  })

  it('shows My Tasks heading when the workspace has projects and tasks', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', populatedWorkspace)
    mockGraphQLQuery('UserOverviewCellQuery', () => ({
      projects: [{ id: 1 }, { id: 2 }],
      tasks: { totalCount: 12 },
    }))
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument()
    })
  })

  it('shows overview description when workspace is populated', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', populatedWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByText('Overview of all tasks across your projects.')
      ).toBeInTheDocument()
    })
  })

  it('renders task status filter buttons when workspace is populated', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', populatedWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'All Tasks' })
      ).toBeInTheDocument()
    })
  })

  it('does NOT show welcome section when workspace has data', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', populatedWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.queryByText('Welcome to your Task Manager')
      ).not.toBeInTheDocument()
    })
  })

  it('does NOT show "Create your first project" button when workspace has data', async () => {
    mockGraphQLQuery('HomePageWorkspaceQuery', populatedWorkspace)
    renderWithContexts(<HomePage />)
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Create your first project' })
      ).not.toBeInTheDocument()
    })
  })
})
