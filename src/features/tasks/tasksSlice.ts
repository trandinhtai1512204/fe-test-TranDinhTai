import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { Task, TaskFilters, TaskPagination } from '@/types/task'
import { mockTasks } from '@/utils/mockData'
import type { RootState } from '@/store'
import dayjs from 'dayjs'

interface TasksState {
  items: Task[]
  filters: TaskFilters
  pagination: TaskPagination
}

const initialState: TasksState = {
  items: mockTasks,
  filters: {
    searchText: '',
    status: [],
    priority: '',
    dateRange: null,
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload)
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.items.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    deleteManyTasks(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.items = state.items.filter((t) => !ids.has(t.id))
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: Task['status'] }>) {
      const task = state.items.find((t) => t.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
      }
    },
    setFilter(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.currentPage = 1
    },
    resetFilters(state) {
      state.filters = initialState.filters
      state.pagination.currentPage = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload
    },
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
} = tasksSlice.actions

export default tasksSlice.reducer

const selectTasksState = (state: RootState) => state.tasks

export const selectAllTasks = createSelector(selectTasksState, (s) => s.items)

const selectFilters = createSelector(selectTasksState, (s) => s.filters)

const selectPagination = createSelector(selectTasksState, (s) => s.pagination)

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilters,
  (tasks, filters) => {
    let result = tasks

    if (filters.searchText.trim()) {
      const lower = filters.searchText.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(lower))
    }

    if (filters.status.length > 0) {
      result = result.filter((t) => filters.status.includes(t.status))
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority)
    }

    if (filters.dateRange) {
      const [from, to] = filters.dateRange
      result = result.filter((t) => {
        if (!t.dueDate) return false
        const due = dayjs(t.dueDate)
        return (
          (due.isAfter(dayjs(from), 'day') || due.isSame(dayjs(from), 'day')) &&
          (due.isBefore(dayjs(to), 'day') || due.isSame(dayjs(to), 'day'))
        )
      })
    }

    return result
  },
)

export const selectPaginatedTasks = createSelector(
  selectFilteredTasks,
  selectPagination,
  (filtered, pagination) => {
    const { currentPage, pageSize } = pagination
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  },
)

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => ({
  total: tasks.length,
  todo: tasks.filter((t) => t.status === 'todo').length,
  inProgress: tasks.filter((t) => t.status === 'in_progress').length,
  done: tasks.filter((t) => t.status === 'done').length,
}))
