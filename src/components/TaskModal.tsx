import { useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker, Radio } from 'antd'
import dayjs from 'dayjs'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'
import { useAppDispatch } from '@/store/hooks'
import { addTask, updateTask } from '@/features/tasks/tasksSlice'
import { nanoid } from '@reduxjs/toolkit'

interface Props {
  open: boolean
  editingTask: Task | null
  onClose: () => void
}

interface FormValues {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: dayjs.Dayjs
  tags?: string[]
}

export default function TaskModal({ open, editingTask, onClose }: Props) {
  const [form] = Form.useForm<FormValues>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (open) {
      if (editingTask) {
        form.setFieldsValue({
          ...editingTask,
          dueDate: editingTask.dueDate ? dayjs(editingTask.dueDate) : undefined,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, editingTask, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const now = new Date().toISOString()

    if (editingTask) {
      dispatch(
        updateTask({
          ...editingTask,
          ...values,
          dueDate: values.dueDate?.format('YYYY-MM-DD'),
        }),
      )
    } else {
      dispatch(
        addTask({
          id: nanoid(),
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          assignee: values.assignee,
          dueDate: values.dueDate?.format('YYYY-MM-DD'),
          createdAt: now,
          tags: values.tags,
        }),
      )
    }

    onClose()
  }

  return (
    <Modal
      title={editingTask ? 'Edit Task' : 'Add New Task'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={editingTask ? 'Save Changes' : 'Add Task'}
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter description (optional)" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="todo">Todo</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Priority is required' }]}
          >
            <Radio.Group>
              <Radio.Button value="low">Low</Radio.Button>
              <Radio.Button value="medium">Medium</Radio.Button>
              <Radio.Button value="high">High</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="assignee" label="Assignee">
            <Input placeholder="Assignee name" />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Add tags (press Enter)" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
