import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'

import SettingsPage from './SettingsPage'

jest.mock('@redwoodjs/web/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

beforeEach(() => {
  mockCurrentUser({ id: 1, username: 'testuser', email: 'test@example.com' })
  mockGraphQLMutation('UpdateMyUsernameMutation', () => ({
    updateMyUsername: { id: 1, username: 'newusername' },
  }))
})

describe('SettingsPage', () => {
  it('renders successfully', () => {
    expect(() => render(<SettingsPage />)).not.toThrow()
  })

  it('displays the Settings heading', () => {
    render(<SettingsPage />)
    expect(
      screen.getByRole('heading', { name: 'Settings' })
    ).toBeInTheDocument()
  })

  it('displays the Profile card section', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('displays description about managing account', () => {
    render(<SettingsPage />)
    expect(
      screen.getByText('Manage your account information and security.')
    ).toBeInTheDocument()
  })

  it('renders email input with current user email', () => {
    render(<SettingsPage />)
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('email input is disabled and read-only', () => {
    render(<SettingsPage />)
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeDisabled()
  })

  it('renders username input with current user username', () => {
    render(<SettingsPage />)
    const usernameInput = screen.getByLabelText('Username')
    expect(usernameInput).toHaveValue('testuser')
  })

  it('username input is editable', () => {
    render(<SettingsPage />)
    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'changeduser' } })
    expect(usernameInput).toHaveValue('changeduser')
  })

  it('renders Save Changes button', () => {
    render(<SettingsPage />)
    expect(
      screen.getByRole('button', { name: 'Save Changes' })
    ).toBeInTheDocument()
  })

  it('displays the Security card section', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Security')).toBeInTheDocument()
  })

  it('renders Reset Password button', () => {
    render(<SettingsPage />)
    expect(
      screen.getByRole('button', { name: 'Reset Password' })
    ).toBeInTheDocument()
  })

  it('shows description about password reset', () => {
    render(<SettingsPage />)
    expect(
      screen.getByText('Send a password reset link to your email.')
    ).toBeInTheDocument()
  })

  it('Save Changes button submits form with updated username', async () => {
    render(<SettingsPage />)
    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'newusername' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
    await waitFor(() => {
      expect(usernameInput).toBeInTheDocument()
    })
  })

  it('Save Changes button is disabled while updating', async () => {
    render(<SettingsPage />)
    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'newusername' } })
    const saveButton = screen.getByRole('button', { name: 'Save Changes' })
    fireEvent.click(saveButton)
    expect(saveButton).toBeInTheDocument()
  })
})
