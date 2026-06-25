import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Añadir galería de miniaturas después del carrusel
c = c.replace(
  "{route.photos.length > 1 && (",
  `{route.photos.length > 1 && (
              <div style={{display: 'flex', gap: '8px', padding: '8px', overflowX: 'auto', background: '#050B18'}}>
                {route.photos.map((photo, i) => (
                  <img key={i} src={photo.url} alt={route.title + ' foto ' + (i+1)} onClick={() => setCurrentPhoto(i)} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === currentPhoto ? '2px solid #f97316' : '2px solid transparent', flexShrink: 0}} />
                ))}
              </div>
            )}
            {route.photos.length > 1 && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
