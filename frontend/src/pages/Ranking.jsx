import { useState, useEffect } from 'react'
import { getRanking } from '../services/ranking.service.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Ranking() {
  const { user: currentUser } = useAuthStore()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRanking()
      .then((data) => setRanking(data.ranking))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-8'>
        <h1 style={{color: 'white'}} className='text-2xl font-bold mb-2'>Ranking de senderistas</h1>
        <p style={{color: '#64748b', fontSize: '14px', marginBottom: '24px'}}>Los mejores aventureros de TrailBlaze</p>
        {loading && <div style={{color: '#94a3b8'}} className='text-center py-16'>Cargando ranking...</div>}
        <div className='flex flex-col gap-3'>
          {ranking.map((entry) => (
            <a key={entry.id} href={'/profile/' + entry.username} style={{background: currentUser && currentUser.id === entry.id ? '#2e1065' : '#1e293b', border: currentUser && currentUser.id === entry.id ? '1px solid #7c3aed' : '1px solid #334155', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none'}}>
              <div style={{width: '36px', textAlign: 'center'}}>
                <span style={{color: entry.position === 1 ? '#eab308' : entry.position === 2 ? '#94a3b8' : entry.position === 3 ? '#b45309' : '#475569', fontWeight: '500', fontSize: '15px'}}>#{entry.position}</span>
              </div>
              <div style={{width: '38px', height: '38px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', color: 'white', fontSize: '15px'}}>
                {entry.username[0].toUpperCase()}
              </div>
              <div style={{flex: 1}}>
                <p style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '15px'}}>{entry.username}</p>
                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>{entry._count.routes} rutas · {entry._count.completions} completadas</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{color: '#eab308', fontWeight: '500', margin: 0, fontSize: '18px'}}>{entry.points}</p>
                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>puntos</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ranking