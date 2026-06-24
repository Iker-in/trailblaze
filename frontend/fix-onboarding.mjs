import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", "utf8")

c = c.replace(
  "import OfflineBanner from",
  "import Onboarding from './components/Onboarding.jsx'\nimport OfflineBanner from"
)

c = c.replace(
  "function App() {\n  return (",
  `function App() {
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('arventra_onboarding_done'))
  return (`
)

c = c.replace(
  "import { HashRouter, Routes, Route } from 'react-router-dom'",
  "import { HashRouter, Routes, Route } from 'react-router-dom'\nimport { useState } from 'react'"
)

c = c.replace(
  "<HashRouter>\n      <OfflineBanner />",
  "<HashRouter>\n      <OfflineBanner />\n      {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/App.jsx", c)
console.log("Listo")
