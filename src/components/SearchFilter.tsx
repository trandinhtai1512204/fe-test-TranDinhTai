import { useCallback, useEffect, useRef } from 'react'
import { Input, Select, DatePicker, Button, Space } from 'antd'
import { FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setFilter, resetFilters } from '@/features/tasks/tasksSlice'
import type { RootState } from '@/store'
import type { Dayjs } from 'dayjs'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const selectFilters = (state: RootState) => state.tasks.filters

export default function SearchFilter() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)
  const [searchParams, setSearchParams] = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync URL → Redux on mount
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const status = searchParams.getAll('status')
    const priority = searchParams.get('priority') ?? ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    dispatch(
      setFilter({
        searchText: q,
        status,
        priority,
        dateRange: from && to ? [from, to] : null,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateURL = useCallback(
    (patch: Partial<typeof filters>) => {
      const merged = { ...filters, ...patch }
      const params = new URLSearchParams()
      if (merged.searchText) params.set('q', merged.searchText)
      merged.status.forEach((s) => params.append('status', s))
      if (merged.priority) params.set('priority', merged.priority)
      if (merged.dateRange) {
        params.set('from', merged.dateRange[0])
        params.set('to', merged.dateRange[1])
      }
      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams],
  )

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      dispatch(setFilter({ searchText: value }))
      updateURL({ searchText: value })
    }, 300)
  }

  const handleStatusChange = (value: string[]) => {
    dispatch(setFilter({ status: value }))
    updateURL({ status: value })
  }

  const handlePriorityChange = (value: string) => {
    dispatch(setFilter({ priority: value }))
    updateURL({ priority: value })
  }

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const range =
      dates && dates[0] && dates[1]
        ? ([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] as [string, string])
        : null
    dispatch(setFilter({ dateRange: range }))
    updateURL({ dateRange: range })
  }

  const handleReset = () => {
    dispatch(resetFilters())
    setSearchParams({}, { replace: true })
  }

  const dateRangeValue: [Dayjs, Dayjs] | null =
    filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <FilterOutlined className="text-gray-400" />

      <Input.Search
        placeholder="Search by title..."
        defaultValue={filters.searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={handleSearch}
        allowClear
        className="w-56"
      />

      <Select
        mode="multiple"
        placeholder="Status"
        value={filters.status}
        onChange={handleStatusChange}
        className="min-w-[160px]"
        allowClear
        options={[
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Done', value: 'done' },
        ]}
      />

      <Select
        placeholder="Priority"
        value={filters.priority || undefined}
        onChange={handlePriorityChange}
        className="w-32"
        allowClear
        options={[
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ]}
      />

      <RangePicker
        value={dateRangeValue}
        onChange={handleDateRangeChange}
        format="DD/MM/YYYY"
        placeholder={['From date', 'To date']}
      />

      <Space>
        <Button icon={<ClearOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </div>
  )
}
