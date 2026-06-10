import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api.js'
import Navbar from '../components/Navbar.jsx'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Las contrasenas no coinciden')
    if (password.length < 8) return setError('Minimo 8 caracteres')
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Token invalido o expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div style={{maxWidth: '400px', margin: '80px auto', padding: '0 16px'}}>
        <div style={{background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px'}}>
          <h1 style={{color: 'white', fontSize: '22px', fontWeight: '500', margin: '0 0 8px'}}>Nueva contrasena</h1>
          <p style={{color: '#64748b', fontSize: '14px', margin: '0 0 24px'}}>Elige una contrasena segura.</p>

          {done ? (
            <>
              <p style={{color: '#86efac', fontSize: '14px', textAlign: 'center', marginBottom: '20px'}}>Contrasena actualizada correctamente.</p>
              <a href="/login" style={{display: 'block', textAlign: 'center', background: '#7c3aed', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Ir al login</a>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Nueva contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box'}}
              />
              <input
                type="password"
                placeholder="Confirmar contrasena"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                style={{width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box'}}
              />
              {error && <p style={{color: '#fca5a5', fontSize: '13px', margin: '0 0 12px'}}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{width: '100%', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '15px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1}}
              >
                {loading ? 'Guardando...' : 'Cambiar contrasena'}
              </button>
            </form>
          )}

          <p style={{textAlign: 'center', marginTop: '20px', fontSize: '13px'}}>
            <a href="/login" style={{color: '#7c3aed', textDecoration: 'none'}}>Volver al login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword