function Home() {
  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-4">TrailBlaze</h1>
        <p className="text-xl text-green-600 mb-8">
          Descubre, comparte y conquista rutas de senderismo
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">
            Crear cuenta
          </a>
          <a href="/login" className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50">
            Iniciar sesion
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
