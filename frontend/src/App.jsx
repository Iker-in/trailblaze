import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoutesList from './pages/Routes'
import CreateRoute from './pages/CreateRoute'
import RouteDetail from './pages/RouteDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/routes" element={<RoutesList />} />
        <Route path="/routes/create" element={<CreateRoute />} />
        <Route path="/routes/:id" element={<RouteDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App