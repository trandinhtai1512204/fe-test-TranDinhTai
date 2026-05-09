export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
  createdAt: string
  tags?: string[]
}

export interface TaskFilters {
  searchText: string
  status: string[]
  priority: string
  dateRange: [string, string] | null
}

export interface TaskPagination {
  currentPage: number
  pageSize: number
}

export interface TaskStats {
  total: number
  todo: number
  inProgress: number
  done: number
}
