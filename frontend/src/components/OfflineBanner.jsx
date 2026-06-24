import { useState, useEffect } from "react"

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div style={{
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      background: "#7c2d12",
      color: "#fdba74",
      padding: "10px 20px",
      textAlign: "center",
      fontSize: "13px",
      fontWeight: "500",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    }}>
      <span>📵</span>
      <span>Sin conexión — algunas funciones pueden no estar disponibles</span>
    </div>
  )
}

export default OfflineBanner
