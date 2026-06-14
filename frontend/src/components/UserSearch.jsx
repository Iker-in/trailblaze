import { useState, useEffect, useRef } from 'react'
import { searchUsers } from '../services/users.service.js'

function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const timeout = setTimeout(() => {
      searchUsers(query).then((data) => { setResults(data.users); setOpen(true) }).catch(() => {})
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar senderistas..."
        style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '6px 12px', color: 'white', fontSize: '13px', outline: 'none', width: '160px'}}
      />
      {open && (
        <div style={{position: 'absolute', left: 0, top: '36px', width: '240px', background: '#241640', border: '1px solid #ec4899', borderRadius: '12px', zIndex: 100, overflow: 'hidden'}}>
          {results.length === 0 && (
            <p style={{color: '#5a4670', fontSize: '13px', textAlign: 'center', padding: '16px'}}>Sin resultados</p>
          )}
          {results.map((u) => (
            <a key={u.id} href={'/profile/' + u.username} onClick={() => setOpen(false)} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #3d2a5c'}}>
              <div style={{width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0}}>
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.username} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <div style={{width: '100%', height: '100%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', color: 'white'}}>
                    {u.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <span style={{color: 'white', fontSize: '13px'}}>{u.username}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserSearch