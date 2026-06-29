import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Login.jsx", "utf8")
c = c.replace(
  "      login(data.user, data.token)\n      navigate('/')",
  `      login(data.user, data.token)
      const pendingTrack = localStorage.getItem('arventra_track')
      if (pendingTrack) {
        navigate('/routes/create')
      } else {
        navigate('/')
      }`
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Login.jsx", c)
console.log("Listo")
