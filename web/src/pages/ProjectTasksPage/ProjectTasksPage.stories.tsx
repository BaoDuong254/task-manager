import type { Meta, StoryObj } from '@storybook/react'

import ProjectTasksPage from './ProjectTasksPage'

const meta: Meta<typeof ProjectTasksPage> = {
  component: ProjectTasksPage,
}

export default meta

type Story = StoryObj<typeof ProjectTasksPage>

export const Primary: Story = {}
