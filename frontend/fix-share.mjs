import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Añadir función handleShare antes de handleDeleteRoute
c = c.replace(
  "  const handleDeleteRoute = async () => {",
  `  const handleShare = () => {
    const url = window.location.origin + '/#/routes/' + id
    if (navigator.share) {
      navigator.share({ title: route.title, text: 'Mira esta ruta en ARVENTRA: ' + route.title, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado al portapapeles')
    }
  }

  const handleDeleteRoute = async () => {`
)

// Añadir botón compartir junto a Editar
c = c.replace(
  "<Link to={'/routes/' + id + '/edit'}",
  `<button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer'}}>Compartir</button>
                    <Link to={'/routes/' + id + '/edit'}`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
