import { useState, useEffect } from 'react'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Home() {
  const { isAuthenticated, user } = useAuthStore()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data)).catch(() => {})
  }, [])

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        {isAuthenticated ? (
          <>
            <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500', margin: '0 0 12px'}}>BIENVENIDO DE VUELTA</p>
            <h2 style={{color: 'white', fontSize: '40px', fontWeight: '500', margin: '0 0 8px', letterSpacing: '-1px'}}>{user.username}</h2>
            <p style={{color: '#64748b', fontSize: '16px', margin: '0 0 36px'}}>Listo para tu proxima aventura?</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '60px'}}>
              <a href="/routes" style={{background: '#eab308', color: '#0f172a', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none'}}>Explorar rutas</a>
              <a href="/routes/create" style={{border: '1px solid #334155', color: '#94a3b8', padding: '12px 28px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none'}}>Publicar ruta</a>
            </div>
          </>
        ) : (
          <>
            <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500', margin: '0 0 16px'}}>PLATAFORMA PARA SENDERISTAS</p>
            <h1 style={{color: 'white', fontSize: '64px', fontWeight: '500', margin: '0 0 16px', letterSpacing: '-3px'}}>TrailBlaze</h1>
            <p style={{color: '#64748b', fontSize: '18px', margin: '0 0 40px'}}>Descubre, comparte y conquista rutas de senderismo</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '60px'}}>
              <a href="/register" style={{background: '#eab308', color: '#0f172a', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none'}}>Crear cuenta</a>
              <a href="/login" style={{border: '1px solid #334155', color: '#94a3b8', padding: '12px 28px', borderRadius: '12px', fontSize: '15px', textDecoration: 'none'}}>Iniciar sesion</a>
            </div>
          </>
        )}

        {stats && (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '500px', margin: '0 auto 60px'}}>
            {[
              { value: stats.users, label: 'senderistas' },
              { value: stats.routes, label: 'rutas publicadas' },
              { value: stats.completions, label: 'rutas completadas' }
            ].map((stat) => (
              <div key={stat.label} style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px 12px', textAlign: 'center'}}>
                <p style={{color: '#eab308', fontSize: '32px', fontWeight: '500', margin: '0 0 4px'}}>{stat.value}</p>
                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'left'}}>
          {[
            { title: 'Descubre rutas', desc: 'Explora cientos de rutas de senderismo con mapas interactivos y fotos reales de otros aventureros.', color: '#7c3aed' },
            { title: 'Gana puntos', desc: 'Completa rutas, consigue logros y sube en el ranking global de la comunidad TrailBlaze.', color: '#ec4899' },
            { title: 'Conecta', desc: 'Sigue a otros senderistas, comenta sus rutas y forma parte de una comunidad activa.', color: '#eab308' }
          ].map((feature) => (
            <div key={feature.title} style={{background: '#1e293b', border: '1px solid #334155', borderLeft: '3px solid ' + feature.color, borderRadius: '14px', padding: '20px'}}>
              <h3 style={{color: 'white', fontWeight: '500', margin: '0 0 8px', fontSize: '15px'}}>{feature.title}</h3>
              <p style={{color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.6'}}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
