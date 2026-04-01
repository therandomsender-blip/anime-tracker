import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Collection from './pages/Collection'
import Search from './pages/Search'
import AnimeDetail from './pages/AnimeDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="collection" element={<Collection />} />
          <Route path="search" element={<Search />} />
          <Route path="anime/:id" element={<AnimeDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
