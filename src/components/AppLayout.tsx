import { useState } from 'react'
import { Layout, Menu, Button, ConfigProvider, theme } from 'antd'
import {
  DashboardOutlined,
  UnorderedListOutlined,
  MoonOutlined,
  SunOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import TaskModal from './TaskModal'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const selectedKey = location.pathname === '/' ? 'dashboard' : 'tasks'

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: '#1677ff' },
      }}
    >
      <div className={darkMode ? 'dark' : ''}>
        <Layout className="min-h-screen">
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            theme={darkMode ? 'dark' : 'light'}
            className="shadow-md"
          >
            <div className="p-4 text-center">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-blue-600'}`}>
                TaskBoard
              </span>
            </div>
            <Menu
              theme={darkMode ? 'dark' : 'light'}
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
              style={{
                background: darkMode ? '#141414' : '#fff',
                borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
              }}
            >
              <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedKey === 'dashboard' ? 'Dashboard' : 'Task List'}
              </span>
              <div className="flex items-center gap-3">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                  Add New
                </Button>
                <Button
                  type="text"
                  icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={() => setDarkMode((d) => !d)}
                />
              </div>
            </Header>
            <Content
              style={{
                background: darkMode ? '#1f1f1f' : '#f5f7fa',
                minHeight: 'calc(100vh - 64px)',
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
        <TaskModal open={modalOpen} editingTask={null} onClose={() => setModalOpen(false)} />
      </div>
    </ConfigProvider>
  )
}
