import { HashRouter, Routes, Route, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RoutesList from "./pages/Routes"
import CreateRoute from "./pages/CreateRoute"
import RecordRoute from "./pages/RecordRoute"
import RouteDetail from "./pages/RouteDetail"
import Profile from "./pages/Profile"
import Ranking from "./pages/Ranking"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Achievements from "./pages/Achievements"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import EditRoute from "./pages/EditRoute"
import LiveTrack from "./pages/LiveTrack.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import Onboarding from "./components/Onboarding.jsx"
import OfflineBanner from "./components/OfflineBanner.jsx"
import TermsAndConditions from "./pages/TermsAndConditions.jsx"
import PageTransition from "./components/PageTransition.jsx"
import { Toaster } from "sonner"

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/routes" element={<PageTransition><RoutesList /></PageTransition>} />
        <Route path="/routes/create" element={<PageTransition><ProtectedRoute><CreateRoute /></ProtectedRoute></PageTransition>} />
        <Route path="/routes/:id" element={<PageTransition><RouteDetail /></PageTransition>} />
        <Route path="/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/ranking" element={<PageTransition><Ranking /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/routes/record" element={<PageTransition><ProtectedRoute><RecordRoute /></ProtectedRoute></PageTransition>} />
        <Route path="/routes/:id/edit" element={<PageTransition><ProtectedRoute><EditRoute /></ProtectedRoute></PageTransition>} />
        <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsAndConditions /></PageTransition>} />
        <Route path="/track/:sessionId" element={<PageTransition><LiveTrack /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("arventra_onboarding_done"))
  return (
    <HashRouter>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{ style: { background: "#0D1F35", border: "1px solid #1A3050", color: "white" } }}
      />
      <OfflineBanner />
      {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
      <AnimatedRoutes />
    </HashRouter>
  )
}

export default App
