import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from '@/store'
import AppLayout from '@/components/AppLayout'
import Dashboard from '@/pages/Dashboard'
import TaskList from '@/pages/TaskList'
import './index.css'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
