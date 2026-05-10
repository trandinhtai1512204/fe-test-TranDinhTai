import { useState } from 'react'
import { Table, Tag, Select, Button, Popconfirm, Space, Empty } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, TableProps } from 'antd/es/table'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectFilteredTasks,
  selectPaginatedTasks,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setPage,
} from '@/features/tasks/tasksSlice'
import type { Task, TaskStatus } from '@/types/task'
import type { RootState } from '@/store'
import TaskModal from '@/components/TaskModal'
import SearchFilter from '@/components/SearchFilter'

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const statusTag: Record<TaskStatus, { color: string; label: string }> = {
  todo: { color: 'default', label: 'Todo' },
  in_progress: { color: 'processing', label: 'In Progress' },
  done: { color: 'success', label: 'Done' },
}

const priorityTag: Record<string, { color: string; label: string }> = {
  high: { color: 'error', label: 'High' },
  medium: { color: 'warning', label: 'Medium' },
  low: { color: 'success', label: 'Low' },
}

const selectPaginationState = (state: RootState) => state.tasks.pagination

export default function TaskList() {
  const dispatch = useAppDispatch()
  const filteredTasks = useAppSelector(selectFilteredTasks)
  const paginatedTasks = useAppSelector(selectPaginatedTasks)
  const pagination = useAppSelector(selectPaginationState)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id))
    setSelectedRowKeys((prev) => prev.filter((k) => k !== id))
  }

  const handleBulkDelete = () => {
    dispatch(deleteManyTasks(selectedRowKeys))
    setSelectedRowKeys([])
  }

  const handleStatusChange = (id: string, status: TaskStatus) => {
    dispatch(updateTaskStatus({ id, status }))
  }

  const handleTableChange: TableProps<Task>['onChange'] = (_pagination) => {
    if (_pagination.current) {
      dispatch(setPage(_pagination.current))
    }
  }

  const columns: ColumnsType<Task> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string) => <span className="font-medium">{text}</span>,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: TaskStatus, record: Task) => (
        <Select
          value={status}
          size="small"
          className="w-full"
          options={statusOptions}
          onChange={(val) => handleStatusChange(record.id, val)}
          onClick={(e) => e.stopPropagation()}
          variant="borderless"
          labelRender={({ value }) => {
            const s = statusTag[value as TaskStatus]
            return <Tag color={s?.color}>{s?.label}</Tag>
          }}
        />
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      sorter: (a, b) => {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      },
      render: (priority: string) => {
        const p = priorityTag[priority]
        return <Tag color={p?.color}>{p?.label}</Tag>
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 140,
      render: (v?: string) => v ?? <span className="text-gray-400">—</span>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 130,
      sorter: (a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix()
      },
      render: (v?: string) =>
        v ? (
          <span className={dayjs(v).isBefore(dayjs(), 'day') ? 'text-red-500' : 'text-gray-600'}>
            {dayjs(v).format('DD/MM/YYYY')}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      fixed: 'right',
      render: (_: unknown, record: Task) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            className="text-blue-500"
          />
          <Popconfirm
            title="Delete this task?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <SearchFilter />
      {selectedRowKeys.length > 0 && (
        <div className="mb-3 flex items-center gap-3">
          <span className="text-gray-600">{selectedRowKeys.length} task(s) selected</span>
          <Popconfirm
            title={`Delete ${selectedRowKeys.length} task(s)?`}
            onConfirm={handleBulkDelete}
            okText="Delete All"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete Selected
            </Button>
          </Popconfirm>
        </div>
      )}
      <Table<Task>
        rowKey="id"
        dataSource={paginatedTasks}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as string[]),
        }}
        pagination={{
          current: pagination.currentPage,
          pageSize: pagination.pageSize,
          total: filteredTasks.length,
          showTotal: (total) => `Total ${total} tasks`,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        locale={{ emptyText: <Empty description="No tasks found" /> }}
        scroll={{ x: 800 }}
        className="bg-white rounded-lg shadow-sm"
        onRow={(record) => ({ onDoubleClick: () => openEdit(record) })}
        sortDirections={['ascend', 'descend']}
      />
      <TaskModal open={modalOpen} editingTask={editingTask} onClose={() => setModalOpen(false)} />
    </div>
  )
}
