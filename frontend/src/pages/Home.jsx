import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'

function Home() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div style={{minHeight: '100vh', background: '#0f172a'}}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        {isAuthenticated ? (
          <>
            <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500'}} className="mb-3">BIENVENIDO DE VUELTA</p>
            <h2 style={{color: 'white'}} className="text-4xl font-bold mb-4">{user.username}</h2>
            <p style={{color: '#94a3b8'}} className="text-lg mb-10">Listo para tu proxima aventura?</p>
            <div className="flex gap-4 justify-center">
              <a href="/routes" style={{background: '#eab308', color: '#0f172a'}} className="px-8 py-3 rounded-xl font-bold text-base hover:opacity-90">Explorar rutas</a>
              <a href="/routes/create" style={{border: '1px solid #334155', color: '#94a3b8'}} className="px-8 py-3 rounded-xl text-base hover:border-purple-500 hover:text-white">Publicar ruta</a>
            </div>
          </>
        ) : (
          <>
            <p style={{color: '#eab308', fontSize: '13px', letterSpacing: '2px', fontWeight: '500'}} className="mb-4">PLATAFORMA PARA SENDERISTAS</p>
            <h1 style={{color: 'white', letterSpacing: '-2px'}} className="text-6xl font-bold mb-6">TrailBlaze</h1>
            <p style={{color: '#94a3b8'}} className="text-xl mb-12">Descubre, comparte y conquista rutas de senderismo</p>
            <div className="flex gap-4 justify-center">
              <a href="/register" style={{background: '#eab308', color: '#0f172a'}} className="px-8 py-3 rounded-xl font-bold text-base hover:opacity-90">Crear cuenta</a>
              <a href="/login" style={{border: '1px solid #334155', color: '#94a3b8'}} className="px-8 py-3 rounded-xl text-base hover:text-white">Iniciar sesion</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
