import type { Meta, StoryObj } from '@storybook/react'

import SettingsPage from './SettingsPage'

const meta: Meta<typeof SettingsPage> = {
  component: SettingsPage,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 600 },
    },
  },
  decorators: [
    (Story) => {
      mockCurrentUser({
        id: 1,
        email: 'user@example.com',
        username: 'JohnDoe',
      })
      return <Story />
    },
  ],
}

export default meta

type Story = StoryObj<typeof SettingsPage>

export const Default: Story = {
  decorators: [
    (Story) => {
      mockGraphQLMutation('UpdateMyUsernameMutation', (_variables, { ctx }) => {
        ctx.delay(500)
        return {
          updateMyUsername: {
            id: 1,
            username: 'NewUsername',
          },
        }
      })
      return <Story />
    },
  ],
}
