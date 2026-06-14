import { useState } from 'react'
import api from '../services/api.js'
import Navbar from '../components/Navbar.jsx'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError('Error al enviar el email. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: '#160d28'}}>
      <Navbar />
      <div style={{maxWidth: '400px', margin: '80px auto', padding: '0 16px'}}>
        <div style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '16px', padding: '32px'}}>
          <h1 style={{color: 'white', fontSize: '22px', fontWeight: '500', margin: '0 0 8px'}}>Recuperar contrasena</h1>
          <p style={{color: '#8b7aa3', fontSize: '14px', margin: '0 0 24px'}}>Te enviaremos un enlace a tu email.</p>

          {sent ? (
            <p style={{color: '#86efac', fontSize: '14px', textAlign: 'center'}}>
              Si ese email esta registrado, recibiras un enlace en breve. Revisa tu bandeja.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{width: '100%', background: '#160d28', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box'}}
              />
              {error && <p style={{color: '#fca5a5', fontSize: '13px', margin: '0 0 12px'}}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{width: '100%', background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '15px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1}}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          )}

          <p style={{textAlign: 'center', marginTop: '20px', fontSize: '13px'}}>
            <a href="/login" style={{color: '#f97316', textDecoration: 'none'}}>Volver al login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword