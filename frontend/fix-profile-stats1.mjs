import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

// Añadir estado de stats
c = c.replace(
  "  const [tab, setTab] = useState('routes')",
  `  const [tab, setTab] = useState('routes')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)`
)

// Añadir fetch de stats cuando se abre el tab
c = c.replace(
  "  const [isFollowing, setIsFollowing] = useState(false)",
  `  const [isFollowing, setIsFollowing] = useState(false)`
)

// Añadir useEffect para cargar stats
c = c.replace(
  "  return (",
  `  useEffect(() => {
    if (tab === 'stats' && !stats) {
      setStatsLoading(true)
      api.get('/users/' + username + '/stats')
        .then(res => setStats(res.data))
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [tab, username])

  return (`
)

// Añadir tab de stats en los botones
c = c.replace(
  "  {['routes', 'completions', 'favorites'].map((t) => (",
  "  {['routes', 'completions', 'favorites', 'stats'].map((t) => ("
)

// Actualizar labels de tabs
c = c.replace(
  "{t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : 'Guardadas (' + favorites.length + ')'}",
  "{t === 'routes' ? 'Publicadas (' + routes.length + ')' : t === 'completions' ? 'Completadas (' + completions.length + ')' : t === 'favorites' ? 'Guardadas (' + favorites.length + ')' : '📊 Stats'}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
console.log("Listo parte 1")
