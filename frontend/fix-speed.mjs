import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", "utf8")

// Añadir estado de velocidad
c = c.replace(
  "  const [accuracy, setAccuracy] = useState(null)",
  "  const [accuracy, setAccuracy] = useState(null)\n  const [speed, setSpeed] = useState(null)"
)

// Capturar velocidad en startRecording
c = c.replace(
  `  const { latitude, longitude, altitude, accuracy } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
},
      () => setError('No se pudo obtener tu ubicacion'),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )`,
  `  const { latitude, longitude, altitude, accuracy, speed } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
  setSpeed(speed)
},
      () => setError('No se pudo obtener tu ubicacion'),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )`
)

// Capturar velocidad en resumeRecording
c = c.replace(
  `  const { latitude, longitude, altitude, accuracy } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
},
    () => setError('No se pudo obtener tu ubicacion'),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  )`,
  `  const { latitude, longitude, altitude, accuracy, speed } = pos.coords
  setPoints((prev) => [...prev, [latitude, longitude, altitude]])
  setAccuracy(accuracy)
  setSpeed(speed)
},
    () => setError('No se pudo obtener tu ubicacion'),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  )`
)

// Mostrar velocidad junto al indicador de precisión
c = c.replace(
  `{recording && accuracy !== null && (
  <p style={{color: accuracy <= 15 ? '#86efac' : accuracy <= 30 ? '#fde68a' : '#fca5a5', fontSize: '12px', marginBottom: '12px'}}>
    {accuracy <= 15 ? 'Senal GPS buena' : accuracy <= 30 ? 'Senal GPS regular' : 'Senal GPS debil'} (±{Math.round(accuracy)}m)
  </p>
)}`,
  `{recording && accuracy !== null && (
  <div style={{display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap'}}>
    <p style={{color: accuracy <= 15 ? '#86efac' : accuracy <= 30 ? '#fde68a' : '#fca5a5', fontSize: '12px', margin: 0}}>
      {accuracy <= 15 ? 'GPS buena' : accuracy <= 30 ? 'GPS regular' : 'GPS debil'} (±{Math.round(accuracy)}m)
    </p>
    {speed !== null && speed >= 0 && (
      <p style={{color: '#fb923c', fontSize: '12px', margin: 0}}>
        🚀 {(speed * 3.6).toFixed(1)} km/h
      </p>
    )}
  </div>
)}`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RecordRoute.jsx", c)
console.log("Listo")
