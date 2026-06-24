import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")
c = c.replace(
  "import PrivacyPolicy from './pages/PrivacyPolicy.jsx'",
  "import PrivacyPolicy from './pages/PrivacyPolicy.jsx'\nimport OfflineBanner from './components/OfflineBanner.jsx'"
)
c = c.replace(
  "<HashRouter>",
  "<HashRouter>\n      <OfflineBanner />"
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", c)
console.log("Listo")
