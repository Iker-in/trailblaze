import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoutesList from './pages/Routes'
import CreateRoute from './pages/CreateRoute'
import RecordRoute from './pages/RecordRoute'
import RouteDetail from './pages/RouteDetail'
import Profile from './pages/Profile'
import Ranking from './pages/Ranking'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Achievements from './pages/Achievements'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EditRoute from './pages/EditRoute'
import LiveTrack from './pages/LiveTrack.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'

function App() {
  return (
    <HashRouter>
      <OfflineBanner />
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/routes" element={<RoutesList />} />
        <Route path="/routes/create" element={<ProtectedRoute><CreateRoute /></ProtectedRoute>} />
        <Route path="/routes/:id" element={<RouteDetail />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/routes/record" element={<ProtectedRoute><RecordRoute /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/routes/:id/edit" element={<ProtectedRoute><EditRoute /></ProtectedRoute>} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/track/:sessionId" element={<LiveTrack />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </HashRouter>
  )
}

export default App