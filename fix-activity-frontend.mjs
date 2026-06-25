import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

// Añadir estado de actividad
c = c.replace(
  "  const [statsLoading, setStatsLoading] = useState(false)",
  `  const [statsLoading, setStatsLoading] = useState(false)
  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)`
)

// Añadir fetch de actividad
c = c.replace(
  "  }, [tab, username])",
  `  }, [tab, username])

  useEffect(() => {
    if (tab === 'activity' && activity.length === 0) {
      setActivityLoading(true)
      api.get('/users/' + username + '/activity')
        .then(res => setActivity(res.data.activity))
        .catch(() => {})
        .finally(() => setActivityLoading(false))
    }
  }, [tab, username])`
)

// Añadir tab de actividad
c = c.replace(
  "  {['routes', 'completions', 'favorites', 'stats'].map((t) => (",
  "  {['routes', 'completions', 'favorites', 'stats', 'activity'].map((t) => ("
)

// Actualizar labels
c = c.replace(
  "{t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : t === 'favorites' ? 'Guardadas (' + favorites.length + ')' : '📊 Stats'}",
  "{t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : t === 'favorites' ? 'Guardadas (' + favorites.length + ')' : t === 'stats' ? '📊 Stats' : '📈 Actividad'}"
)

// Añadir contenido del tab actividad antes del tab favorites
c = c.replace(
  "          {tab === 'favorites' && favorites.length === 0",
  `          {tab === 'activity' && activityLoading && <div style={{textAlign: 'center', padding: '40px', color: '#6B8CAE'}}>Cargando actividad...</div>}
          {tab === 'activity' && !activityLoading && activity.length === 0 && (
            <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#4A6480'}}>Sin actividad reciente.</div>
          )}
          {tab === 'activity' && !activityLoading && activity.map((item, i) => (
            <div key={i} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center'}}>
              <span style={{fontSize: '20px'}}>
                {item.type === 'completion' ? '✅' : item.type === 'achievement' ? (item.icon || '🏅') : '🗺️'}
              </span>
              <div style={{flex: 1}}>
                <p style={{color: 'white', fontSize: '13px', fontWeight: '500', margin: '0 0 2px'}}>
                  {item.type === 'completion' ? 'Completó ' + item.routeTitle : item.type === 'achievement' ? 'Ganó logro: ' + item.name : 'Publicó ' + item.routeTitle}
                </p>
                <p style={{color: '#4A6480', fontSize: '11px', margin: 0}}>
                  {new Date(item.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {(item.type === 'completion' || item.type === 'route') && (
                <Link to={'/routes/' + item.routeId} style={{color: '#f97316', fontSize: '12px', textDecoration: 'none'}}>Ver</Link>
              )}
            </div>
          ))}
          {tab === 'favorites' && favorites.length === 0`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
console.log("Listo")
