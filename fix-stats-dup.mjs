import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

const duplicate = `          {tab === 'stats' && statsLoading && <div style={{textAlign: 'center', padding: '40px', color: '#6B8CAE'}}>Cargando estadisticas...</div>}
          {tab === 'stats' && !statsLoading && stats && stats.hidden && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#6B8CAE'}}>Este usuario tiene sus estadisticas privadas.</div>}
          {tab === 'stats' && !statsLoading && stats && !stats.hidden && (`

const count = c.split(duplicate).length - 1
console.log("Ocurrencias:", count)

if (count === 2) {
  const idx = c.lastIndexOf(duplicate)
  // Encontrar el cierre del bloque duplicado
  const afterDup = c.indexOf("          {tab === 'favorites'", idx)
  c = c.substring(0, idx) + c.substring(afterDup)
  writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
  console.log("Duplicado eliminado")
} else {
  console.log("No se encontro duplicado exacto")
}
