import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Quitar el boton de compartir de donde está
c = c.replace(
  `<button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer'}}>Compartir</button>
                    <Link to={'/routes/' + id + '/edit'}`,
  `<Link to={'/routes/' + id + '/edit'}`
)

// Añadirlo después del bloque de completar ruta (después de la línea de !isAuthenticated)
c = c.replace(
  `{!isAuthenticated && <Link to="/login" style={{background: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: '500', fontSize: '14px', textDecoration: 'none'}}>Inicia sesion para completar</Link>}`,
  `{!isAuthenticated && <Link to="/login" style={{background: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: '500', fontSize: '14px', textDecoration: 'none'}}>Inicia sesion para completar</Link>}
              <button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer'}}>🔗 Compartir ruta</button>`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
