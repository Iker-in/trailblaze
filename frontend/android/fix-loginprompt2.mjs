import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Ranking.jsx", "utf8")

// Añadir import
c = c.replace(
  'import { Link } from "react-router-dom"',
  'import { Link } from "react-router-dom"\nimport LoginPrompt from "../components/LoginPrompt.jsx"'
)

// Mostrar tabs solo si autenticado - ya está con isAuthenticated
// Añadir prompt si no autenticado y intenta ver amigos/anual
c = c.replace(
  `        {tab === "anual" && (`,
  `        {tab === "anual" && !isAuthenticated && <LoginPrompt message="Inicia sesion para ver el ranking anual" />}
        {tab === "anual" && isAuthenticated && (`
)

c = c.replace(
  `        {tab === "amigos" && (`,
  `        {tab === "amigos" && !isAuthenticated && <LoginPrompt message="Inicia sesion para ver el ranking entre amigos" />}
        {tab === "amigos" && isAuthenticated && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Ranking.jsx", c)
console.log("Listo")
