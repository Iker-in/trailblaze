import { useState, useEffect, useRef } from 'react'
import api from '../services/api.js'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unreadCount)
    } catch (err) {}
  }

  const handleOpen = async () => {
    setOpen(!open)
    if (!open && unreadCount > 0) {
      await api.patch('/notifications/read')
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  const getTypeColor = (type) => {
    if (type === 'follow') return '#7c3aed'
    if (type === 'completion') return '#ec4899'
    return '#eab308'
  }

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button onClick={handleOpen} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px'}}>
        <span style={{color: unreadCount > 0 ? '#eab308' : '#64748b', fontSize: '20px'}}>&#9900;</span>
        {unreadCount > 0 && (
          <span style={{position: 'absolute', top: '0', right: '0', background: '#ec4899', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{position: 'absolute', right: 0, top: '36px', width: '300px', background: '#1e293b', border: '1px solid #ec4899', borderRadius: '14px', zIndex: 100, overflow: 'hidden'}}>
          <div style={{padding: '14px 16px', borderBottom: '1px solid #334155'}}>
            <p style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '14px'}}>Notificaciones</p>
          </div>
          <div style={{maxHeight: '320px', overflowY: 'auto'}}>
            {notifications.length === 0 && (
              <p style={{color: '#475569', fontSize: '13px', textAlign: 'center', padding: '24px'}}>Sin notificaciones</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} style={{padding: '12px 16px', borderBottom: '1px solid #0f172a', background: n.read ? 'transparent' : '#0f172a', display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                <div style={{width: '8px', height: '8px', borderRadius: '50%', background: getTypeColor(n.type), marginTop: '5px', flexShrink: 0}} />
                <div>
                  <p style={{color: n.read ? '#94a3b8' : 'white', fontSize: '13px', margin: 0}}>{n.message}</p>
                  <p style={{color: '#475569', fontSize: '11px', margin: '4px 0 0'}}>{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell