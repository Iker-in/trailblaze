import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/components/RouteFollowMap.jsx", "utf8")

c = c.replace(
  "function RouteFollowMap({ route, onClose }) {",
  "function RouteFollowMap({ route, onClose, onComplete }) {"
)

c = c.replace(
  "            {endPos && (",
  `            {(nearStart || nearEnd) && onComplete && (
                <button onClick={onComplete} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px', width: '100%'}}>
                  ✅ Marcar como completada
                </button>
              )}
            {endPos && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/RouteFollowMap.jsx", c)
console.log("Listo")
