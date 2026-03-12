import type { Meta, StoryObj } from '@storybook/react'

import { ProjectDialogContext } from 'src/contexts/ProjectDialogContext'
import { SearchContext } from 'src/contexts/SearchContext'

import HomePage from './HomePage'

const mockSearchContext = {
  search: '',
  setSearch: () => {},
  debouncedSearch: '',
}

const mockProjectDialogContext = {
  openProjectDialog: () => {},
}

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 600 },
    },
  },
  decorators: [
    (Story) => (
      <SearchContext.Provider value={mockSearchContext}>
        <ProjectDialogContext.Provider value={mockProjectDialogContext}>
          <Story />
        </ProjectDialogContext.Provider>
      </SearchContext.Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof HomePage>

export const Welcome: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('HomePageWorkspaceQuery', () => ({
        projects: [],
        tasks: { totalCount: 0 },
      }))
      return <Story />
    },
  ],
}

export const WithTasks: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('HomePageWorkspaceQuery', () => ({
        projects: [{ id: 1 }, { id: 2 }],
        tasks: { totalCount: 5 },
      }))

      mockGraphQLQuery('UserOverviewCellQuery', () => ({
        projects: [{ id: 1 }, { id: 2 }],
        tasks: { totalCount: 5 },
      }))

      mockGraphQLQuery('TaskAnalyticsCellQuery', () => ({
        taskAnalytics: {
          todoCount: 3,
          inProgressCount: 1,
          completedCount: 1,
          totalCompleted: 1,
          totalInProgress: 1,
          upcomingDeadlines: [
            {
              id: 1,
              title: 'Design homepage mockup',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: '2026-03-15T00:00:00Z',
              projectId: 1,
            },
            {
              id: 2,
              title: 'Set up CI/CD pipeline',
              status: 'IN_PROGRESS',
              priority: 'MEDIUM',
              dueDate: '2026-03-20T00:00:00Z',
              projectId: 2,
            },
          ],
        },
      }))

      mockGraphQLQuery('TasksCellQuery', () => ({
        tasks: {
          results: [
            {
              id: 1,
              projectId: 1,
              title: 'Design homepage mockup',
              description:
                'Create wireframes and visual design for the homepage',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: '2026-03-15T00:00:00Z',
              createdAt: '2026-03-01T00:00:00Z',
              updatedAt: '2026-03-10T00:00:00Z',
            },
            {
              id: 2,
              projectId: 2,
              title: 'Set up CI/CD pipeline',
              description: 'Configure GitHub Actions for automated deployment',
              status: 'IN_PROGRESS',
              priority: 'MEDIUM',
              dueDate: '2026-03-20T00:00:00Z',
              createdAt: '2026-03-02T00:00:00Z',
              updatedAt: '2026-03-09T00:00:00Z',
            },
            {
              id: 3,
              projectId: 1,
              title: 'Write unit tests',
              description: 'Add tests for core components',
              status: 'COMPLETED',
              priority: 'LOW',
              dueDate: '2026-03-12T00:00:00Z',
              createdAt: '2026-03-03T00:00:00Z',
              updatedAt: '2026-03-11T00:00:00Z',
            },
          ],
          totalCount: 3,
          page: 1,
          pageSize: 10,
        },
      }))

      return <Story />
    },
  ],
}

export const Loading: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('HomePageWorkspaceQuery', (_variables, { ctx }) => {
        ctx.delay('infinite')
        return {
          projects: [],
          tasks: { totalCount: 0 },
        }
      })
      return <Story />
    },
  ],
}
