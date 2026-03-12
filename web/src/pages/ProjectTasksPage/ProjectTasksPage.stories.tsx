import type { Meta, StoryObj } from '@storybook/react'

import { SearchContext } from 'src/contexts/SearchContext'

import ProjectTasksPage from './ProjectTasksPage'

const mockSearchContext = {
  search: '',
  setSearch: () => {},
  debouncedSearch: '',
}

const meta: Meta<typeof ProjectTasksPage> = {
  component: ProjectTasksPage,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 600 },
    },
  },
  decorators: [
    (Story) => (
      <SearchContext.Provider value={mockSearchContext}>
        <Story />
      </SearchContext.Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ProjectTasksPage>

export const WithTasks: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('ProjectTasksPageProjectQuery', () => ({
        project: {
          id: 1,
          name: 'Marketing Website',
          description: 'Redesign the company marketing website',
        },
      }))

      mockGraphQLQuery('TaskAnalyticsCellQuery', () => ({
        taskAnalytics: {
          todoCount: 2,
          inProgressCount: 1,
          completedCount: 3,
          totalCompleted: 3,
          totalInProgress: 1,
          upcomingDeadlines: [
            {
              id: 1,
              title: 'Update landing page copy',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: '2026-03-18T00:00:00Z',
              projectId: 1,
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
              title: 'Update landing page copy',
              description: 'Rewrite hero section and CTA',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: '2026-03-18T00:00:00Z',
              createdAt: '2026-03-05T00:00:00Z',
              updatedAt: '2026-03-10T00:00:00Z',
            },
            {
              id: 2,
              projectId: 1,
              title: 'Implement responsive design',
              description: 'Make all pages mobile-friendly',
              status: 'IN_PROGRESS',
              priority: 'MEDIUM',
              dueDate: '2026-03-22T00:00:00Z',
              createdAt: '2026-03-06T00:00:00Z',
              updatedAt: '2026-03-11T00:00:00Z',
            },
            {
              id: 3,
              projectId: 1,
              title: 'SEO optimization',
              description: 'Add meta tags and structured data',
              status: 'COMPLETED',
              priority: 'LOW',
              dueDate: '2026-03-10T00:00:00Z',
              createdAt: '2026-03-01T00:00:00Z',
              updatedAt: '2026-03-09T00:00:00Z',
            },
          ],
          totalCount: 3,
          page: 1,
          pageSize: 10,
        },
      }))

      mockGraphQLQuery('TaskFormProjectsQuery', () => ({
        projects: [
          { id: 1, name: 'Marketing Website' },
          { id: 2, name: 'Mobile App' },
        ],
      }))

      return <Story />
    },
  ],
}

export const EmptyProject: Story = {
  decorators: [
    (Story) => {
      mockGraphQLQuery('ProjectTasksPageProjectQuery', () => ({
        project: {
          id: 3,
          name: 'New Project',
          description: 'A fresh project with no tasks yet',
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
        tasks: {
          results: [],
          totalCount: 0,
          page: 1,
          pageSize: 10,
        },
      }))

      return <Story />
    },
  ],
}
