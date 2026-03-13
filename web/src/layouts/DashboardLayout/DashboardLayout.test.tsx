import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'

import DashboardLayout from './DashboardLayout'

beforeEach(() => {
  mockCurrentUser({ id: 1, username: 'testuser', email: 'test@example.com' })
  mockGraphQLQuery('ProjectsCellQuery', () => ({ projects: [] }))
  mockGraphQLMutation('CreateProjectMutation', () => ({
    createProject: { id: 1, name: 'New Project' },
  }))
})

describe('DashboardLayout', () => {
  it('renders successfully', () => {
    expect(() => render(<DashboardLayout />)).not.toThrow()
  })

  it('displays Task Manager brand in the header', () => {
    render(<DashboardLayout />)
    expect(screen.getByText('Task Manager')).toBeInTheDocument()
  })

  it('renders search input with correct placeholder', () => {
    render(<DashboardLayout />)
    expect(
      screen.getByPlaceholderText('Search tasks, projects...')
    ).toBeInTheDocument()
  })

  it('renders My Tasks navigation link', () => {
    render(<DashboardLayout />)
    expect(screen.getByText('My Tasks')).toBeInTheDocument()
  })

  it('renders Settings navigation link', () => {
    render(<DashboardLayout />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('displays current user username and email in sidebar', () => {
    render(<DashboardLayout />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders children inside the main area', () => {
    render(
      <DashboardLayout>
        <div>Child Content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('shows logout confirmation dialog when logout button is clicked', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByLabelText('Logout'))
    await waitFor(() => {
      expect(
        screen.getByText('Are you sure you want to logout?')
      ).toBeInTheDocument()
    })
  })

  it('describes logout consequence in the confirmation dialog', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByLabelText('Logout'))
    await waitFor(() => {
      expect(
        screen.getByText(
          'You will need to sign in again to access your workspace.'
        )
      ).toBeInTheDocument()
    })
  })

  it('closes logout dialog when Cancel is clicked', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByLabelText('Logout'))
    await waitFor(() =>
      expect(
        screen.getByText('Are you sure you want to logout?')
      ).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => {
      expect(
        screen.queryByText('Are you sure you want to logout?')
      ).not.toBeInTheDocument()
    })
  })

  it('opens create project dialog when New button is clicked', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByRole('button', { name: 'New' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('shows the Create Project heading when the project dialog is open', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByRole('button', { name: 'New' }))
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Create Project' })
      ).toBeInTheDocument()
    })
  })

  it('shows project name required error when submitting empty project name', async () => {
    render(<DashboardLayout />)
    fireEvent.click(screen.getByRole('button', { name: 'New' }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }))
    await waitFor(() => {
      expect(screen.getByText('Project name is required.')).toBeInTheDocument()
    })
  })

  it('clears project name error when project dialog is reopened', async () => {
    render(<DashboardLayout />)
    // Open and trigger error
    fireEvent.click(screen.getByRole('button', { name: 'New' }))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }))
    await waitFor(() =>
      expect(screen.getByText('Project name is required.')).toBeInTheDocument()
    )
    // Close the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    // Reopen and error should be gone
    fireEvent.click(screen.getByRole('button', { name: 'New' }))
    await waitFor(() => {
      expect(
        screen.queryByText('Project name is required.')
      ).not.toBeInTheDocument()
    })
  })
})
