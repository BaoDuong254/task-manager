import { render } from '@redwoodjs/testing/web'

import ProjectTasksPage from './ProjectTasksPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ProjectTasksPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProjectTasksPage />)
    }).not.toThrow()
  })
})
