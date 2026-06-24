import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

// Añadir import
c = c.replace(
  "import Navbar from '../components/Navbar.jsx'",
  "import Navbar from '../components/Navbar.jsx'\nimport LoginPrompt from '../components/LoginPrompt.jsx'"
)

// Buscar el botón de seguir y añadir prompt si no autenticado
c = c.replace(
  "  const handleFollow = async () => {",
  `  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleFollow = async () => {`
)

// Reemplazar el botón de seguir para mostrar prompt si no autenticado
c = c.replace(
  "{!isOwnProfile && (",
  `{!isOwnProfile && !isAuthenticated && showLoginPrompt && (
              <LoginPrompt message="Inicia sesion para seguir a este senderista" />
            )}
            {!isOwnProfile && (`
)

// Hacer que el botón seguir muestre el prompt si no autenticado
c = c.replace(
  "onClick={handleFollow}",
  "onClick={() => { if (!isAuthenticated) { setShowLoginPrompt(true) } else { handleFollow() } }}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
console.log("Listo")
