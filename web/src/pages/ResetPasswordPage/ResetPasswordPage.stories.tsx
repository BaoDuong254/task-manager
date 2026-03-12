import type { Meta, StoryObj } from '@storybook/react'

import ResetPasswordPage from './ResetPasswordPage'

const meta: Meta<typeof ResetPasswordPage> = {
  component: ResetPasswordPage,
}

export default meta

type Story = StoryObj<typeof ResetPasswordPage>

export const Default: Story = {
  args: {
    resetToken: 'mock-reset-token-abc123',
  },
}
