function Register() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Crear cuenta</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
            <input type="text" placeholder="senderista123" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="tu@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input type="password" placeholder="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button type="submit" className="bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 mt-2">
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Ya tienes cuenta?
          <a href="/login" className="text-green-700 font-medium hover:underline"> Inicia sesion</a>
        </p>
      </div>
    </div>
  )
}

export default Register
