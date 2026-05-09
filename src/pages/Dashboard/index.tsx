import { Card, Statistic, Progress, Tag, Empty } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { useAppSelector } from '@/store/hooks'
import { selectTaskStats, selectAllTasks } from '@/features/tasks/tasksSlice'
import dayjs from 'dayjs'

const statusColor: Record<string, string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
}

const statusLabel: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function Dashboard() {
  const stats = useAppSelector(selectTaskStats)
  const allTasks = useAppSelector(selectAllTasks)

  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const todoPercent = stats.total ? Math.round((stats.todo / stats.total) * 100) : 0
  const inProgressPercent = stats.total ? Math.round((stats.inProgress / stats.total) * 100) : 0
  const donePercent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

  return (
    <div className="p-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <Statistic
            title="Total Tasks"
            value={stats.total}
            prefix={<UnorderedListOutlined className="text-blue-500" />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
        <Card className="shadow-sm">
          <Statistic
            title="Todo"
            value={stats.todo}
            prefix={<ClockCircleOutlined className="text-gray-500" />}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Card>
        <Card className="shadow-sm">
          <Statistic
            title="In Progress"
            value={stats.inProgress}
            prefix={<SyncOutlined spin className="text-blue-400" />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
        <Card className="shadow-sm">
          <Statistic
            title="Done"
            value={stats.done}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Task Distribution" className="shadow-sm">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Todo</span>
                <span className="font-medium">{todoPercent}%</span>
              </div>
              <Progress percent={todoPercent} showInfo={false} strokeColor="#8c8c8c" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-500">In Progress</span>
                <span className="font-medium">{inProgressPercent}%</span>
              </div>
              <Progress percent={inProgressPercent} showInfo={false} status="active" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green-500">Done</span>
                <span className="font-medium">{donePercent}%</span>
              </div>
              <Progress percent={donePercent} showInfo={false} strokeColor="#52c41a" />
            </div>
          </div>
        </Card>

        <Card title="Overall Completion" className="shadow-sm flex items-center justify-center">
          <div className="flex flex-col items-center py-2">
            <Progress
              type="circle"
              percent={donePercent}
              strokeColor="#52c41a"
              size={140}
              format={(p) => <span className="text-2xl font-bold">{p}%</span>}
            />
            <p className="mt-4 text-gray-500">
              {stats.done} of {stats.total} tasks completed
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card title="Recent Tasks (Last 5 Created)" className="shadow-sm">
        {recentTasks.length === 0 ? (
          <Empty description="No tasks yet" />
        ) : (
          <div className="divide-y">
            {recentTasks.map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium truncate">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {dayjs(task.createdAt).format('DD MMM YYYY')}
                    {task.assignee && ` · ${task.assignee}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Tag color={statusColor[task.status]}>{statusLabel[task.status]}</Tag>
                  {task.dueDate && (
                    <span className="text-xs text-gray-400">
                      Due {dayjs(task.dueDate).format('DD MMM')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
