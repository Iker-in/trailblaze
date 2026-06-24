import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")
c = c.replace(
  "import Achievements from './pages/Achievements.jsx'",
  "import Achievements from './pages/Achievements.jsx'\nimport PrivacyPolicy from './pages/PrivacyPolicy.jsx'"
)
c = c.replace(
  "<Route path=\"/achievements\" element={<Achievements />} />",
  "<Route path=\"/achievements\" element={<Achievements />} />\n        <Route path=\"/privacy\" element={<PrivacyPolicy />} />"
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", c)
console.log("Listo")
