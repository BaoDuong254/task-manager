import type { Meta, StoryObj } from '@storybook/react'

import DashboardLayout from './DashboardLayout'

const meta: Meta<typeof DashboardLayout> = {
  component: DashboardLayout,
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

type Story = StoryObj<typeof DashboardLayout>

export const WithProjects: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('ProjectsCellQuery', () => ({
        projects: [
          {
            id: 1,
            name: 'Marketing Website',
            description: 'Redesign the company website',
            createdAt: '2026-03-01T00:00:00Z',
            updatedAt: '2026-03-10T00:00:00Z',
          },
          {
            id: 2,
            name: 'Mobile App',
            description: 'Build a cross-platform mobile app',
            createdAt: '2026-03-05T00:00:00Z',
            updatedAt: '2026-03-11T00:00:00Z',
          },
        ],
      }))
      return <Story />
    },
  ],
  render: (args) => (
    <DashboardLayout {...args}>
      <div className="tw-p-4 tw-text-foreground">
        <h2 className="tw-text-lg tw-font-semibold">Page Content</h2>
        <p className="tw-text-sm tw-text-muted-foreground">
          This is the main content area rendered inside the layout.
        </p>
      </div>
    </DashboardLayout>
  ),
}

export const EmptyProjects: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('ProjectsCellQuery', () => ({
        projects: [],
      }))
      return <Story />
    },
  ],
  render: (args) => (
    <DashboardLayout {...args}>
      <div className="tw-p-4 tw-text-foreground">
        <p className="tw-text-sm tw-text-muted-foreground">No projects yet.</p>
      </div>
    </DashboardLayout>
  ),
}
