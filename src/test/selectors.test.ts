import { describe, it, expect } from 'vitest'
import { selectTaskStats, selectFilteredTasks } from '@/features/tasks/tasksSlice'
import type { RootState } from '@/store'
import type { Task } from '@/types/task'

const makeTasks = (overrides: Partial<Task>[] = []): Task[] =>
  overrides.map((o, i) => ({
    id: String(i + 1),
    title: `Task ${i + 1}`,
    status: 'todo',
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00Z',
    ...o,
  }))

const makeState = (tasks: Task[], filters = {}): RootState =>
  ({
    tasks: {
      items: tasks,
      filters: {
        searchText: '',
        status: [],
        priority: '',
        dateRange: null,
        ...filters,
      },
      pagination: { currentPage: 1, pageSize: 10 },
    },
  }) as RootState

describe('selectTaskStats', () => {
  it('returns correct counts', () => {
    const tasks = makeTasks([
      { status: 'todo' },
      { status: 'todo' },
      { status: 'in_progress' },
      { status: 'done' },
      { status: 'done' },
      { status: 'done' },
    ])
    const state = makeState(tasks)
    expect(selectTaskStats(state)).toEqual({ total: 6, todo: 2, inProgress: 1, done: 3 })
  })

  it('returns zeros for empty list', () => {
    expect(selectTaskStats(makeState([]))).toEqual({ total: 0, todo: 0, inProgress: 0, done: 0 })
  })
})

describe('selectFilteredTasks', () => {
  it('filters by searchText (case insensitive)', () => {
    const tasks = makeTasks([{ title: 'Fix bug' }, { title: 'Add feature' }, { title: 'Fix tests' }])
    const state = makeState(tasks, { searchText: 'fix' })
    const result = selectFilteredTasks(state)
    expect(result).toHaveLength(2)
    expect(result.map((t) => t.title)).toEqual(['Fix bug', 'Fix tests'])
  })

  it('filters by status', () => {
    const tasks = makeTasks([{ status: 'todo' }, { status: 'done' }, { status: 'in_progress' }])
    const state = makeState(tasks, { status: ['done', 'in_progress'] })
    expect(selectFilteredTasks(state)).toHaveLength(2)
  })

  it('filters by priority', () => {
    const tasks = makeTasks([{ priority: 'high' }, { priority: 'low' }, { priority: 'high' }])
    const state = makeState(tasks, { priority: 'high' })
    expect(selectFilteredTasks(state)).toHaveLength(2)
  })

  it('returns all tasks when no filters applied', () => {
    const tasks = makeTasks([{}, {}, {}])
    expect(selectFilteredTasks(makeState(tasks))).toHaveLength(3)
  })
})
