import { useState, useEffect } from 'react'
import { getRoutes } from '../services/routes.service.js'
import Navbar from '../components/Navbar.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function Routes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [maxDistance, setMaxDistance] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [search, difficulty, maxDistance])

  useEffect(() => {
    loadRoutes()
  }, [search, difficulty, maxDistance, page])

  const loadRoutes = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (difficulty) params.difficulty = difficulty
      if (search) params.search = search
      if (maxDistance) params.maxDistance = maxDistance
      const data = await getRoutes(params)
      setRoutes(data.routes)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch (err) {
      setError('Error al cargar las rutas')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: '#241640', border: '1px solid #3d2a5c', color: '#a78bb5', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', outline: 'none' }

  return (
    <div style={{minHeight: '100vh', background: '#160d28'}}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div style={{marginBottom: '28px'}}>
          <h1 style={{color: 'white', fontSize: '28px', fontWeight: '500', margin: '0 0 4px'}}>Explorar rutas</h1>
          <p style={{color: '#8b7aa3', fontSize: '14px', margin: 0}}>{total} rutas disponibles</p>
        </div>

        <div style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{...inputStyle, flex: 2, minWidth: '180px', color: 'white'}}
          />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '140px', cursor: 'pointer'}}>
            <option value="">Cualquier dificultad</option>
            <option value="facil">Facil</option>
            <option value="moderado">Moderado</option>
            <option value="dificil">Dificil</option>
            <option value="experto">Experto</option>
          </select>
          <select value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '140px', cursor: 'pointer'}}>
            <option value="">Cualquier distancia</option>
            <option value="5">Hasta 5 km</option>
            <option value="10">Hasta 10 km</option>
            <option value="20">Hasta 20 km</option>
            <option value="50">Hasta 50 km</option>
          </select>
          {(search || difficulty || maxDistance) && (
            <button onClick={() => { setSearch(''); setDifficulty(''); setMaxDistance('') }} style={{background: 'transparent', color: '#ec4899', border: '1px solid #ec4899', borderRadius: '10px', padding: '9px 16px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap'}}>
              Limpiar
            </button>
          )}
        </div>

        {loading && <div style={{color: '#a78bb5', textAlign: 'center', padding: '48px'}}>Cargando rutas...</div>}
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px'}}>{error}</div>}

        {!loading && routes.length === 0 && (
          <div style={{textAlign: 'center', padding: '64px 0'}}>
            <p style={{color: '#5a4670', fontSize: '18px', marginBottom: '8px'}}>No hay rutas con esos filtros</p>
            <p style={{color: '#3d2a5c', fontSize: '14px'}}>Intenta cambiar los filtros o publica la primera</p>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px'}}>
          {routes.map((route) => (
            <a key={route.id} href={"/routes/" + route.id} style={{textDecoration: 'none', display: 'block'}}>
              <div style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f97316'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3d2a5c'}
              >
                {route.photos && route.photos.length > 0 ? (
                  <img src={route.photos[0].url} alt={route.title} style={{width: '100%', height: '160px', objectFit: 'cover'}} />
                ) : (
                  <div style={{width: '100%', height: '160px', background: '#160d28', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{color: '#3d2a5c', fontSize: '40px'}}>?</span>
                  </div>
                )}
                <div style={{padding: '16px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                    <h3 style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '15px', flex: 1, marginRight: '8px'}}>{route.title}</h3>
                    <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap', flexShrink: 0}}>{route.difficulty}</span>
                  </div>
                  <p style={{color: '#8b7aa3', fontSize: '13px', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{route.description}</p>
                  <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: '#5a4670', marginBottom: '12px'}}>
                    <span>{route.distanceKm} km</span>
                    {route.elevationM && <span>{route.elevationM} m</span>}
                    {route.estimatedTime && <span>{route.estimatedTime} min</span>}
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #160d28'}}>
                    <span style={{color: '#5a4670', fontSize: '12px'}}>por <span style={{color: '#ec4899'}}>{route.user.username}</span></span>
                    <div style={{display: 'flex', gap: '10px', fontSize: '12px', color: '#5a4670'}}>
                      <span>{route._count.completions} completaciones</span>
                      <span>{route._count.comments} comentarios</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{background: '#241640', color: page === 1 ? '#5a4670' : '#a78bb5', border: '1px solid #3d2a5c', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer'}}>
              Anterior
            </button>
            <span style={{color: '#8b7aa3', fontSize: '13px', padding: '8px 12px'}}>
              {page} de {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{background: '#241640', color: page === totalPages ? '#5a4670' : '#a78bb5', border: '1px solid #3d2a5c', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: page === totalPages ? 'not-allowed' : 'pointer'}}>
              Siguiente
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Routes
