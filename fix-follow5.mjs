import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

c = c.replace(
  "{showFollowMap && route && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} />}",
  "{showFollowMap && route && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} onComplete={() => { setShowFollowMap(false); handleComplete() }} />}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
