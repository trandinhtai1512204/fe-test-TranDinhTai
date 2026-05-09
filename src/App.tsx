import { Provider } from 'react-redux'
import { store } from '@/store'
import './index.css'

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600">TaskBoard</h1>
      </div>
    </Provider>
  )
}
