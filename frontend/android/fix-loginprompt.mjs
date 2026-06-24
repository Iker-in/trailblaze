import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Añadir import
c = c.replace(
  "import Navbar from '../components/Navbar.jsx'",
  "import Navbar from '../components/Navbar.jsx'\nimport LoginPrompt from '../components/LoginPrompt.jsx'"
)

// Reemplazar el link de inicia sesion para completar
c = c.replace(
  `{!isAuthenticated && <Link to="/login" style={{background: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: '500', fontSize: '14px', textDecoration: 'none'}}>Inicia sesion para completar</Link>}`,
  `{!isAuthenticated && <LoginPrompt message="Inicia sesion para completar esta ruta" />}`
)

// Reemplazar el link de inicia sesion para comentar
c = c.replace(
  `<Link to="/login" style={{color: '#f97316'}}>Inicia sesion</Link> para comentar`,
  `<LoginPrompt message="Inicia sesion para comentar" />`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
