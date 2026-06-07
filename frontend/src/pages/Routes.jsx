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
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => { loadRoutes() }, [difficulty])

  const loadRoutes = async () => {
    setLoading(true)
    try {
      const params = {}
      if (difficulty) params.difficulty = difficulty
      const data = await getRoutes(params)
      setRoutes(data.routes)
    } catch (err) {
      setError('Error al cargar las rutas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{color: 'white'}} className="text-2xl font-bold">Rutas de senderismo</h1>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', outline: 'none'}}>
            <option value="">Todas las dificultades</option>
            <option value="facil">Facil</option>
            <option value="moderado">Moderado</option>
            <option value="dificil">Dificil</option>
            <option value="experto">Experto</option>
          </select>
        </div>
        {loading && <div style={{color: '#94a3b8'}} className="text-center py-16">Cargando rutas...</div>}
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px'}}>{error}</div>}
        <div className="flex flex-col gap-4">
          {routes.map((route) => (
            <div key={route.id} style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px'}}>
              <div className="flex justify-between items-start mb-3">
                <h2 style={{color: 'white'}} className="text-lg font-bold">{route.title}</h2>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
              </div>
              <p style={{color: '#64748b', fontSize: '14px', marginBottom: '14px'}}>{route.description.substring(0, 120)}...</p>
              <div className="flex gap-6" style={{fontSize: '13px', color: '#94a3b8', marginBottom: '14px'}}>
                <span>{route.distanceKm} km</span>
                {route.elevationM && <span>{route.elevationM} m</span>}
                {route.estimatedTime && <span>{route.estimatedTime} min</span>}
                <span>{route._count.completions} completaciones</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{color: '#475569', fontSize: '13px'}}>por {route.user.username}</span>
                <a href={"/routes/" + route.id} style={{background: '#7c3aed', color: 'white', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>Ver ruta</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Routes
