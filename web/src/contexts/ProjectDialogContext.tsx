import { createContext, useContext } from 'react'

type ProjectDialogContextValue = {
  openProjectDialog: () => void
}

export const ProjectDialogContext = createContext<ProjectDialogContextValue>({
  openProjectDialog: () => {},
})

export const useProjectDialog = () => useContext(ProjectDialogContext)
