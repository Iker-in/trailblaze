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
    if (type === 'follow') return '#f97316'
    if (type === 'completion') return '#f43f5e'
    return '#fb923c'
  }

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button onClick={handleOpen} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px'}}>
        <span style={{color: unreadCount > 0 ? '#fb923c' : '#4A6480', fontSize: '20px'}}>&#9900;</span>
        {unreadCount > 0 && (
          <span style={{position: 'absolute', top: '0', right: '0', background: '#f43f5e', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{position: 'absolute', right: 0, top: '36px', width: '300px', background: '#0D1F35', border: '1px solid #f43f5e', borderRadius: '14px', zIndex: 100, overflow: 'hidden'}}>
          <div style={{padding: '14px 16px', borderBottom: '1px solid #1A3050'}}>
            <p style={{color: 'white', fontWeight: '500', margin: 0, fontSize: '14px'}}>Notificaciones</p>
          </div>
          <div style={{maxHeight: '320px', overflowY: 'auto'}}>
            {notifications.length === 0 && (
              <p style={{color: '#2A4A6A', fontSize: '13px', textAlign: 'center', padding: '24px'}}>Sin notificaciones</p>
            )}
            {notifications.map((n) => (
  <a key={n.id} href={n.link || '#'} onClick={() => setOpen(false)} style={{padding: '12px 16px', borderBottom: '1px solid #050B18', background: n.read ? 'transparent' : '#050B18', display: 'flex', gap: '10px', alignItems: 'flex-start', textDecoration: 'none', cursor: n.link ? 'pointer' : 'default'}}>
    <div style={{width: '8px', height: '8px', borderRadius: '50%', background: getTypeColor(n.type), marginTop: '5px', flexShrink: 0}} />
    <div>
      <p style={{color: n.read ? '#6B8CAE' : 'white', fontSize: '13px', margin: 0}}>{n.message}</p>
      <p style={{color: '#2A4A6A', fontSize: '11px', margin: '4px 0 0'}}>{new Date(n.createdAt).toLocaleDateString()}</p>
    </div>
  </a>
))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell