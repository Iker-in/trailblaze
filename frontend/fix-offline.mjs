import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", "utf8")

// Añadir estado de online/offline y recuperación
c = c.replace(
  "  const [accuracy, setAccuracy] = useState(null)",
  `  const [accuracy, setAccuracy] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [savedSession, setSavedSession] = useState(null)`
)

// Detectar online/offline
c = c.replace(
  "const timerRef = useRef(null)",
  `// Detectar cambios de conectividad
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Recuperar sesion guardada al montar
  useEffect(() => {
    const saved = localStorage.getItem('arventra_recording_session')
    if (saved) {
      try {
        const session = JSON.parse(saved)
        if (session.points && session.points.length > 1) {
          setSavedSession(session)
        }
      } catch {}
    }
  }, [])

  // Guardar puntos en localStorage continuamente
  useEffect(() => {
    if (recording && points.length > 0) {
      localStorage.setItem('arventra_recording_session', JSON.stringify({
        points,
        elapsedSeconds,
        savedAt: Date.now()
      }))
    }
  }, [points, elapsedSeconds, recording])

const timerRef = useRef(null)`
)

// Limpiar sesion al finalizar
c = c.replace(
  "  setRecording(false)\n  setPaused(false)\n  clearInterval(timerRef.current)",
  `  setRecording(false)
  setPaused(false)
  clearInterval(timerRef.current)
  localStorage.removeItem('arventra_recording_session')`
)

// Añadir indicador offline y recuperacion antes del mapa
c = c.replace(
  "        {error && <div",
  `        {!isOnline && (
          <div style={{background: '#422006', border: '1px solid #f97316', color: '#fdba74', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span>📵</span>
            <span>Modo offline — el GPS sigue grabando, los mapas pueden no cargar</span>
          </div>
        )}

        {savedSession && !recording && (
          <div style={{background: '#1a0a2e', border: '1px solid #ec4899', borderRadius: '12px', padding: '14px', marginBottom: '16px'}}>
            <p style={{color: '#ec4899', fontSize: '14px', fontWeight: '500', margin: '0 0 8px'}}>Grabacion interrumpida detectada</p>
            <p style={{color: '#a78bb5', fontSize: '13px', margin: '0 0 12px'}}>{savedSession.points.length} puntos guardados</p>
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={() => {
                setPoints(savedSession.points)
                setElapsedSeconds(savedSession.elapsedSeconds || 0)
                setSavedSession(null)
              }} style={{flex: 1, background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
                Recuperar
              </button>
              <button onClick={() => {
                localStorage.removeItem('arventra_recording_session')
                setSavedSession(null)
              }} style={{flex: 1, background: '#241640', color: '#a78bb5', border: '1px solid #3d2a5c', borderRadius: '8px', padding: '8px', fontSize: '13px', cursor: 'pointer'}}>
                Descartar
              </button>
            </div>
          </div>
        )}

        {error && <div`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", c)
console.log("Listo")
