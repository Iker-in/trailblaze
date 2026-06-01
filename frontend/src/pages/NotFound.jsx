function NotFound() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
        <p className="text-xl text-green-600 mb-8">Esta ruta no existe</p>
        <a href="/" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

export default NotFound
