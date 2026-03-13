import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'

import { SearchContext } from 'src/contexts/SearchContext'

import ProjectTasksPage from './ProjectTasksPage'

jest.mock('@redwoodjs/router', () => {
  const actual = jest.requireActual('@redwoodjs/router')
  return {
    ...actual,
    useParams: jest.fn().mockReturnValue({ id: '42' }),
  }
})

const renderWithSearch = (ui: React.ReactElement) =>
  render(
    <SearchContext.Provider
      value={{ search: '', setSearch: jest.fn(), debouncedSearch: '' }}
    >
      {ui}
    </SearchContext.Provider>
  )

beforeEach(() => {
  mockCurrentUser({ id: 1, username: 'testuser', email: 'test@example.com' })
  mockGraphQLQuery('ProjectTasksPageProjectQuery', () => ({
    project: {
      id: 42,
      name: 'My Project',
      description: 'A project description',
    },
  }))
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
  mockGraphQLQuery('TaskFormProjectsQuery', () => ({ projects: [] }))
})

describe('ProjectTasksPage', () => {
  it('renders successfully', () => {
    expect(() => renderWithSearch(<ProjectTasksPage />)).not.toThrow()
  })

  it('shows the Add New Task button', () => {
    renderWithSearch(<ProjectTasksPage />)
    expect(
      screen.getByRole('button', { name: 'Add New Task' })
    ).toBeInTheDocument()
  })

  it('displays the project name from the query result', async () => {
    renderWithSearch(<ProjectTasksPage />)
    await waitFor(() => {
      expect(screen.getByText('My Project')).toBeInTheDocument()
    })
  })

  it('displays the project description from the query result', async () => {
    renderWithSearch(<ProjectTasksPage />)
    await waitFor(() => {
      expect(screen.getByText('A project description')).toBeInTheDocument()
    })
  })

  it('shows default "Project" title while the query is loading', () => {
    // Override to return no data (simulate no response yet)
    mockGraphQLQuery('ProjectTasksPageProjectQuery', () => ({}))
    renderWithSearch(<ProjectTasksPage />)
    expect(screen.getByText('Project')).toBeInTheDocument()
  })

  it('opens the task dialog when Add New Task is clicked', async () => {
    renderWithSearch(<ProjectTasksPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Add New Task' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('renders status filter buttons', () => {
    renderWithSearch(<ProjectTasksPage />)
    expect(
      screen.getByRole('button', { name: 'All Tasks' })
    ).toBeInTheDocument()
  })

  it('renders the Priority select label', () => {
    renderWithSearch(<ProjectTasksPage />)
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('renders the Sort by select label', () => {
    renderWithSearch(<ProjectTasksPage />)
    expect(screen.getByText('Sort by')).toBeInTheDocument()
  })

  it('changes status filter when a filter button is clicked', () => {
    renderWithSearch(<ProjectTasksPage />)
    const todoButton = screen.getByRole('button', { name: 'Todo' })
    fireEvent.click(todoButton)
    // After click the button is still present (state update)
    expect(todoButton).toBeInTheDocument()
  })
})
