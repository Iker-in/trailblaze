import { useState, useEffect } from 'react'
import { getRanking } from '../services/ranking.service.js'
import useAuthStore from '../store/authStore.js'

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
    <div className='min-h-screen bg-green-50'>
      <nav className='bg-white shadow-sm px-6 py-4 flex justify-between items-center'>
        <a href='/' className='text-xl font-bold text-green-800'>TrailBlaze</a>
        <a href='/routes' className='text-green-700 hover:underline text-sm'>Explorar rutas</a>
      </nav>
      <div className='max-w-2xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-green-800 mb-6'>Ranking de senderistas</h1>
        {loading && <div className='text-center py-16 text-green-600'>Cargando ranking...</div>}
        <div className='flex flex-col gap-3'>
          {ranking.map((entry) => (
            <a key={entry.id} href={'/profile/' + entry.username} className='bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow'>
              <div className='w-12 text-center'>
                <span className='text-lg font-bold text-gray-500'>#{entry.position}</span>
              </div>
              <div className='w-10 h-10 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-800'>
                {entry.username[0].toUpperCase()}
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-800'>{entry.username}</p>
                <p className='text-xs text-gray-400'>{entry._count.routes} rutas · {entry._count.completions} completadas</p>
              </div>
              <div className='text-right'>
                <p className='text-xl font-bold text-green-700'>{entry.points}</p>
                <p className='text-xs text-gray-400'>puntos</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ranking