import { useState } from 'react'
import { Layout, Menu, Button } from 'antd'
import { DashboardOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import TaskModal from './TaskModal'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const selectedKey = location.pathname === '/' ? 'dashboard' : 'tasks'

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0" className="shadow-md">
        <div className="p-4 text-center">
          <span className="text-xl font-bold text-blue-600">TaskBoard</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: 'tasks',
              icon: <UnorderedListOutlined />,
              label: <Link to="/tasks">Task List</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between px-6 shadow-sm"
          style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}
        >
          <span className="text-lg font-semibold text-gray-800">
            {selectedKey === 'dashboard' ? 'Dashboard' : 'Task List'}
          </span>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Add New
          </Button>
        </Header>
        <Content style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
      <TaskModal open={modalOpen} editingTask={null} onClose={() => setModalOpen(false)} />
    </Layout>
  )
}
