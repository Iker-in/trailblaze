import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", "utf8")

// Añadir import del servicio
c = c.replace(
  "import { useNavigate } from 'react-router-dom'",
  "import { useNavigate } from 'react-router-dom'\nimport { startTracking, updateTracking, stopTracking } from '../services/tracking.service.js'"
)

// Añadir estado de tracking
c = c.replace(
  "  const [isOnline, setIsOnline] = useState(navigator.onLine)",
  `  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [trackingSessionId, setTrackingSessionId] = useState(null)
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const trackingIntervalRef = useRef(null)`
)

// Limpiar tracking al detener
c = c.replace(
  "  setRecording(false)\n  setPaused(false)\n  clearInterval(timerRef.current)\n  localStorage.removeItem('arventra_recording_session')",
  `  setRecording(false)
  setPaused(false)
  clearInterval(timerRef.current)
  localStorage.removeItem('arventra_recording_session')
  if (trackingEnabled) {
    stopTracking().catch(() => {})
    clearInterval(trackingIntervalRef.current)
    setTrackingSessionId(null)
    setTrackingEnabled(false)
  }`
)

// Añadir botón de tracking y link para compartir antes del cierre del div de botones
c = c.replace(
  "  {!recording && points.length > 1 && (",
  `  {recording && isOnline && (
    <div style={{marginTop: '16px', padding: '14px', background: '#1a0a2e', border: '1px solid #3d2a5c', borderRadius: '12px'}}>
      {!trackingEnabled ? (
        <button onClick={async () => {
          if (points.length > 0) {
            try {
              const [lat, lng] = points[points.length - 1]
              const res = await startTracking(lat, lng)
              setTrackingSessionId(res.data.sessionId)
              setTrackingEnabled(true)
              trackingIntervalRef.current = setInterval(() => {
                if (points.length > 0) {
                  const [la, lo] = points[points.length - 1]
                  updateTracking(la, lo).catch(() => {})
                }
              }, 30000)
            } catch {}
          }
        }} style={{width: '100%', background: '#ec4899', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>
          🛡️ Activar seguimiento de seguridad
        </button>
      ) : (
        <div>
          <p style={{color: '#86efac', fontSize: '13px', margin: '0 0 8px'}}>✅ Seguimiento activo</p>
          <p style={{color: '#a78bb5', fontSize: '12px', margin: '0 0 10px'}}>Comparte este link con tu contacto de emergencia:</p>
          <div style={{background: '#160d28', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px'}}>
            <p style={{color: '#fbbf24', fontSize: '11px', margin: 0, wordBreak: 'break-all'}}>
              {window.location.origin + '/#/track/' + trackingSessionId}
            </p>
          </div>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.origin + '/#/track/' + trackingSessionId)
          }} style={{width: '100%', background: '#241640', color: '#fbbf24', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
            Copiar link
          </button>
        </div>
      )}
    </div>
  )}

  {!recording && points.length > 1 && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", c)
console.log("Listo")
