import { useState, useEffect } from 'react'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function RouteCard({ route }) {
  return (
    <a href={'/routes/' + route.id} style={{textDecoration: 'none'}}>
      <div
        style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', overflow: 'hidden'}}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
      >
        {route.photos && route.photos.length > 0 ? (
          <img src={route.photos[0].url} alt={route.title} style={{width: '100%', height: '140px', objectFit: 'cover'}} />
        ) : (
          <div style={{width: '100%', height: '140px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: '#334155', fontSize: '32px'}}>?</span>
          </div>
        )}
        <div style={{padding: '14px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
            <h3 style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '14px'}}>{route.title}</h3>
            <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500'}}>{route.difficulty}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569'}}>
            <span>{route.distanceKm} km ? por {route.user.username}</span>
            <span>{route._count.completions} completaciones</span>
          </div>
        </div>
      </div>
    </a>
  )
}

function Home() {
  const { isAuthenticated, user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [popular, setPopular] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [feed, setFeed] = useState([])
  const [feedLoading, setFeedLoading] = useState(false)

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data)).catch(() => {})
    api.get('/routes/popular').then((res) => setPopular(res.data.routes)).catch(() => {})
    api.get('/ranking?limit=3').then((res) => setTopUsers(res.data.ranking)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    setFeedLoading(true)
    api.get('/routes/feed')
      .then((res) => setFeed(res.data.routes))
      .catch(() => {})
      .finally(() => setFeedLoading(false))
  }, [isAuthenticated])

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">

        <div style={{textAlign: 'center', marginBottom: '60px'}}>
          {isAuthenticated ? (
            <>
              <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500', margin: '0 0 12px'}}>BIENVENIDO DE VUELTA</p>
              <h2 style={{color: 'white', fontSize: '40px', fontWeight: '500', margin: '0 0 8px', letterSpacing: '-1px'}}>{user.username}</h2>
              <p style={{color: '#64748b', fontSize: '16px', margin: '0 0 28px'}}>Listo para tu proxima aventura?</p>
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                <a href="/routes" style={{background: '#eab308', color: '#0f172a', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none'}}>Explorar rutas</a>
                <a href="/routes/create" style={{border: '1px solid #334155', color: '#94a3b8', padding: '12px 28px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none'}}>Publicar ruta</a>
              </div>
            </>
          ) : (
            <>
              <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500', margin: '0 0 16px'}}>PLATAFORMA PARA SENDERISTAS</p>
              <h1 style={{color: 'white', fontSize: '64px', fontWeight: '500', margin: '0 0 16px', letterSpacing: '-3px'}}>TrailBlaze</h1>
              <p style={{color: '#64748b', fontSize: '18px', margin: '0 0 32px'}}>Descubre, comparte y conquista rutas de senderismo</p>
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                <a href="/register" style={{background: '#eab308', color: '#0f172a', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none'}}>Crear cuenta</a>
                <a href="/login" style={{border: '1px solid #334155', color: '#94a3b8', padding: '12px 28px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none'}}>Iniciar sesion</a>
              </div>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div style={{marginBottom: '60px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{color: 'white', fontSize: '20px', fontWeight: '500', margin: 0}}>Tu feed</h2>
              <a href="/routes" style={{color: '#7c3aed', fontSize: '14px', textDecoration: 'none'}}>Explorar todas</a>
            </div>
            {feedLoading ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#475569'}}>Cargando...</div>
            ) : feed.length > 0 ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px'}}>
                {feed.map((route) => <RouteCard key={route.id} route={route} />)}
              </div>
            ) : (
              <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '40px', textAlign: 'center'}}>
                <p style={{color: '#94a3b8', fontSize: '15px', margin: '0 0 16px'}}>Aun no sigues a ningun senderista.</p>
                <a href="/ranking" style={{background: '#7c3aed', color: 'white', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', fontWeight: '500'}}>Descubrir senderistas</a>
              </div>
            )}
          </div>
        )}

        {stats && (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '60px'}}>
            {[
              { value: stats.users, label: 'senderistas' },
              { value: stats.routes, label: 'rutas publicadas' },
              { value: stats.completions, label: 'rutas completadas' }
            ].map((stat) => (
              <div key={stat.label} style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '24px', textAlign: 'center'}}>
                <p style={{color: '#eab308', fontSize: '36px', fontWeight: '500', margin: '0 0 4px'}}>{stat.value}</p>
                <p style={{color: '#64748b', fontSize: '13px', margin: 0}}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {popular.length > 0 && (
          <div style={{marginBottom: '60px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{color: 'white', fontSize: '20px', fontWeight: '500', margin: 0}}>Rutas populares</h2>
              <a href="/routes" style={{color: '#7c3aed', fontSize: '14px', textDecoration: 'none'}}>Ver todas</a>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px'}}>
              {popular.map((route) => <RouteCard key={route.id} route={route} />)}
            </div>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px'}}>
          <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{color: 'white', fontSize: '16px', fontWeight: '500', margin: 0}}>Top senderistas</h2>
              <a href="/ranking" style={{color: '#7c3aed', fontSize: '13px', textDecoration: 'none'}}>Ver ranking</a>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {topUsers.map((u) => (
                <a key={u.id} href={'/profile/' + u.username} style={{display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none'}}>
                  <span style={{color: u.position === 1 ? '#eab308' : '#475569', fontSize: '13px', fontWeight: '500', minWidth: '24px'}}>#{u.position}</span>
                  <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: 'white'}}>{u.username[0].toUpperCase()}</div>
                  <span style={{color: '#94a3b8', fontSize: '14px', flex: 1}}>{u.username}</span>
                  <span style={{color: '#eab308', fontSize: '13px', fontWeight: '500'}}>{u.points} pts</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px'}}>
            <h2 style={{color: 'white', fontSize: '16px', fontWeight: '500', margin: '0 0 16px'}}>Por que TrailBlaze?</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {[
                { title: 'Mapas interactivos', desc: 'Ve exactamente donde empieza cada ruta', color: '#7c3aed' },
                { title: 'Sistema de puntos', desc: 'Compite y sube en el ranking global', color: '#ec4899' },
                { title: 'Comunidad activa', desc: 'Conecta con senderistas de todo el mundo', color: '#eab308' }
              ].map((f) => (
                <div key={f.title} style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                  <div style={{width: '8px', height: '8px', borderRadius: '50%', background: f.color, marginTop: '5px', flexShrink: 0}} />
                  <div>
                    <p style={{color: 'white', fontSize: '13px', fontWeight: '500', margin: '0 0 2px'}}>{f.title}</p>
                    <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
