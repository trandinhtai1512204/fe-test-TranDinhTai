import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '@/features/tasks/tasksSlice'
import Dashboard from '@/pages/Dashboard'
import type { Task } from '@/types/task'

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Alpha Task',
    status: 'todo',
    priority: 'high',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    title: 'Beta Task',
    status: 'done',
    priority: 'low',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    title: 'Gamma Task',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-15T00:00:00Z',
  },
]

const makeStore = (tasks: Task[]) =>
  configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: {
      tasks: {
        items: tasks,
        filters: { searchText: '', status: [], priority: '', dateRange: null },
        pagination: { currentPage: 1, pageSize: 10 },
      },
    },
  })

const renderDashboard = (tasks: Task[] = sampleTasks) =>
  render(
    <Provider store={makeStore(tasks)}>
      <Dashboard />
    </Provider>,
  )

describe('Dashboard', () => {
  it('renders statistic cards with correct counts', () => {
    renderDashboard()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    // Labels appear multiple times (stat card title + progress label + recent task tag)
    expect(screen.getAllByText('Todo').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Done').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('In Progress').length).toBeGreaterThanOrEqual(1)
  })

  it('shows "Recent Tasks" section', () => {
    renderDashboard()
    expect(screen.getByText(/Recent Tasks/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    renderDashboard([])
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('lists recent task titles', () => {
    renderDashboard()
    expect(screen.getByText('Alpha Task')).toBeInTheDocument()
    expect(screen.getByText('Beta Task')).toBeInTheDocument()
    expect(screen.getByText('Gamma Task')).toBeInTheDocument()
  })
})
