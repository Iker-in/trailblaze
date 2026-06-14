import Navbar from '../components/Navbar.jsx'

function NotFound() {
  return (
    <div style={{minHeight: '100vh', background: '#160d28'}}>
      <Navbar />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)'}}>
        <div style={{textAlign: 'center'}}>
          <h1 style={{color: '#fbbf24', fontSize: '80px', fontWeight: '500', margin: 0, letterSpacing: '-4px'}}>404</h1>
          <p style={{color: '#a78bb5', fontSize: '18px', margin: '12px 0 32px'}}>Esta ruta no existe</p>
          <a href="/" style={{background: '#f97316', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none'}}>Volver al inicio</a>
        </div>
      </div>
    </div>
  )
}

export default NotFound
