import { useState, useEffect } from 'react'
import { getRanking } from '../services/ranking.service.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import LevelBadge from '../components/LevelBadge.jsx'

function Ranking() {
  const { user: currentUser } = useAuthStore()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getRanking()
      .then((data) => setRanking(data.ranking))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = ranking.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{minHeight: '100vh', background: '#160d28'}}>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-8'>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <h1 style={{color: 'white', fontSize: '26px', fontWeight: '500', margin: 0}}>Ranking</h1>
          <input type='text' placeholder='Buscar usuario...' value={search} onChange={(e) => setSearch(e.target.value)} style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', outline: 'none', width: '180px'}} />
        </div>
        <p style={{color: '#8b7aa3', fontSize: '14px', marginBottom: '24px'}}>{ranking.length} senderistas en la comunidad</p>
        {loading && <div style={{color: '#a78bb5', textAlign: 'center', padding: '48px'}}>Cargando ranking...</div>}
        <div className='flex flex-col gap-3'>
          {filtered.map((entry) => (
            <a key={entry.id} href={'/profile/' + entry.username} style={{background: currentUser && currentUser.id === entry.id ? '#2e1065' : '#241640', border: currentUser && currentUser.id === entry.id ? '1px solid #f97316' : '1px solid #3d2a5c', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none'}}>
              <div style={{width: '36px', textAlign: 'center'}}>
                <span style={{color: entry.position === 1 ? '#fbbf24' : entry.position === 2 ? '#a78bb5' : entry.position === 3 ? '#b45309' : '#5a4670', fontWeight: '500', fontSize: '15px'}}>#{entry.position}</span>
              </div>
              <div style={{width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #3d2a5c', flexShrink: 0}}>
  {entry.avatarUrl ? (
    <img src={entry.avatarUrl} alt={entry.username} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  ) : (
    <div style={{width: '100%', height: '100%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', color: 'white', fontSize: '15px'}}>
      {entry.username[0].toUpperCase()}
    </div>
  )}
</div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
  <p style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '15px'}}>{entry.username}{currentUser && currentUser.id === entry.id ? ' (tu)' : ''}</p>
  <LevelBadge points={entry.points} size="sm" />
</div>
                <p style={{color: '#8b7aa3', fontSize: '12px', margin: 0}}>{entry._count.routes} rutas · {entry._count.completions} completadas · {entry._count.followers} seguidores</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{color: '#fbbf24', fontWeight: '500', margin: 0, fontSize: '18px'}}>{entry.points}</p>
                <p style={{color: '#8b7aa3', fontSize: '12px', margin: 0}}>puntos</p>
              </div>
            </a>
          ))}
          {filtered.length === 0 && !loading && <div style={{color: '#5a4670', textAlign: 'center', padding: '32px'}}>No se encontro ese usuario</div>}
        </div>
      </div>
    </div>
  )
}

export default Ranking