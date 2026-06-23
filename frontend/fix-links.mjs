import { readFileSync, writeFileSync } from "fs"

const files = [
  "src/pages/CreateRoute.jsx",
  "src/pages/ForgotPassword.jsx",
  "src/pages/Login.jsx",
  "src/pages/NotFound.jsx",
  "src/pages/Profile.jsx",
  "src/pages/Register.jsx",
  "src/pages/ResetPassword.jsx",
  "src/pages/RouteDetail.jsx"
]

for (const file of files) {
  let c = readFileSync(`C:/proyectos/trailblaze/frontend/${file}`, "utf8")
  
  // Add Link import if not present
  if (!c.includes("import { Link }") && !c.includes("Link }")) {
    c = c.replace(
      /import { useNavigate } from "react-router-dom"/,
      'import { useNavigate, Link } from "react-router-dom"'
    )
    c = c.replace(
      /import { useNavigate } from 'react-router-dom'/,
      "import { useNavigate, Link } from 'react-router-dom'"
    )
    if (!c.includes("useNavigate")) {
      c = c.replace(
        /from 'react-router-dom'/,
        "from 'react-router-dom'"
      )
      // Add Link import at top
      c = "import { Link } from 'react-router-dom'\n" + c
    }
  }

  // Replace <a href="..."> with <Link to="...">
  c = c.replace(/<a href="([^"]+)"/g, '<Link to="$1"')
  // Replace <a href={'...'} with <Link to={'...'}
  c = c.replace(/<a href=\{'/g, "<Link to={'")
  // Replace <a href={'/' + ...} with <Link to={'/' + ...}
  c = c.replace(/<a href=\{`/g, "<Link to={`")
  // Replace </a> with </Link>
  c = c.replace(/<\/a>/g, "</Link>")

  writeFileSync(`C:/proyectos/trailblaze/frontend/${file}`, c)
  console.log("Fixed:", file)
}
