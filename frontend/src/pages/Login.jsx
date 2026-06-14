import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/auth.service.js'
import useAuthStore from '../store/authStore.js'

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(formData.email, formData.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: '#160d28', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#241640', border: '1px solid #3d2a5c', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px'}}>
        <a href="/" style={{color: '#fbbf24', fontWeight: 'bold', fontSize: '20px', display: 'block', marginBottom: '28px'}}>ARVENTRA</a>
        <h2 style={{color: 'white', fontSize: '22px', fontWeight: '500', marginBottom: '24px'}}>Iniciar sesion</h2>
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label style={{color: '#a78bb5', fontSize: '13px', display: 'block', marginBottom: '6px'}}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" style={{width: '100%', background: '#160d28', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box'}} required />
          </div>
          <div>
            <label style={{color: '#a78bb5', fontSize: '13px', display: 'block', marginBottom: '6px'}}>Contrasena</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="tu contrasena" style={{width: '100%', background: '#160d28', border: '1px solid #3d2a5c', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box'}} required />
          </div>
          <button type="submit" disabled={loading} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.6 : 1}}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{color: '#8b7aa3', fontSize: '13px', textAlign: 'center', marginTop: '20px'}}>
          No tienes cuenta?{' '}
          <a href="/register" style={{color: '#f97316'}}>Registrate</a>
        </p>
        <p style={{textAlign: 'center', marginTop: '12px'}}>
          <a href="/forgot-password" style={{color: '#5a4670', fontSize: '13px'}}>Olvidaste tu contrasena?</a>
        </p>
      </div>
    </div>
  )
}

export default Login