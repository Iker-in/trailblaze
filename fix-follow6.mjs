import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

c = c.replace(
  "                <button onClick={() => { if (!isAuthenticated) { navigate('/login'); return } setShowFollowMap(true) }} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>",
  "                <button onClick={() => setShowFollowMap(true)} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>"
)

// Añadir LoginPrompt debajo del boton si no autenticado
c = c.replace(
  "              )}\n              {route.trackPoints && route.trackPoints.length > 1 && (",
  "              )}\n              {!isAuthenticated && showFollowMap && <LoginPrompt message=\"Inicia sesion para seguir y completar rutas\" />}\n              {route.trackPoints && route.trackPoints.length > 1 && ("
)

// Mostrar RouteFollowMap solo si autenticado
c = c.replace(
  "{showFollowMap && route && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} onComplete={() => { setShowFollowMap(false); handleComplete() }} />}",
  "{showFollowMap && route && isAuthenticated && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} onComplete={() => { setShowFollowMap(false); handleComplete() }} />}"
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
