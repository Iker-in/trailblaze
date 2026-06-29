import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

c = c.replace(
  "                <button onClick={() => setShowFollowMap(true)} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>",
  "                <button onClick={() => { if (!isAuthenticated) { navigate('/login'); return } setShowFollowMap(true) }} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
