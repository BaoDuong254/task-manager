import type { BoardTask, TaskStatus } from 'src/types/task.type'

import { TaskColumn } from './TaskColumn'

type TaskBoardProps = {
  tasks: BoardTask[]
  onAddTask?: (status: TaskStatus) => void
  onEditTask?: (task: BoardTask) => void
  onDeleteTask?: (task: BoardTask) => void
}

const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED']

const statusTitle: Record<TaskStatus, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const TaskBoard = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskBoardProps) => {
  const grouped: Record<TaskStatus, BoardTask[]> = {
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  }

  for (const task of tasks) {
    grouped[task.status].push(task)
  }

  return (
    <section className="tw-grid tw-gap-4 md:tw-grid-cols-3">
      {statusOrder.map((status) => (
        <TaskColumn
          key={status}
          title={statusTitle[status]}
          status={status}
          tasks={grouped[status]}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  )
}

export default TaskBoard
