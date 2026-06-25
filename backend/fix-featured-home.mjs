import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8")

// Añadir estado de ruta destacada
c = c.replace(
  '  const [feedLoading, setFeedLoading] = useState(false)',
  `  const [feedLoading, setFeedLoading] = useState(false)
  const [featured, setFeatured] = useState(null)`
)

// Fetch de ruta destacada
c = c.replace(
  '    api.get("/routes/popular").then((res) => setPopular(res.data.routes)).catch(() => {})',
  `    api.get("/routes/popular").then((res) => setPopular(res.data.routes)).catch(() => {})
    api.get("/routes/featured").then((res) => setFeatured(res.data)).catch(() => {})`
)

// Añadir sección destacada antes de rutas populares
c = c.replace(
  '        {popular.length > 0 && (',
  `        {featured && featured.route && (
          <div style={{marginBottom: "60px"}}>
            <h2 style={{color: "white", fontSize: "20px", fontWeight: "500", margin: "0 0 16px"}}>⭐ Ruta destacada de la semana</h2>
            <Link to={"/routes/" + featured.route.id} style={{textDecoration: "none", display: "block"}}>
              <div style={{background: "#0D1F35", border: "1px solid #f97316", borderRadius: "14px", overflow: "hidden"}}>
                {featured.route.photos && featured.route.photos.length > 0 && (
                  <img src={featured.route.photos[0].url} alt={featured.route.title} style={{width: "100%", height: "200px", objectFit: "cover"}} />
                )}
                <div style={{padding: "16px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                    <h3 style={{color: "white", fontSize: "18px", fontWeight: "500", margin: 0}}>{featured.route.title}</h3>
                    <span style={{background: "#f97316", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "500"}}>DESTACADA</span>
                  </div>
                  <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 8px"}}>por {featured.route.user.username}</p>
                  <div style={{display: "flex", gap: "16px", fontSize: "12px", color: "#4A6480"}}>
                    <span>{featured.route.distanceKm} km</span>
                    <span>{featured.route._count.completions} completaciones</span>
                    <span>🔥 {featured.completionsThisWeek} esta semana</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {popular.length > 0 && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", c)
console.log("Listo")
