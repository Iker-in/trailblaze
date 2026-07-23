import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api.js"
import useAuthStore from "../store/authStore.js"
import Navbar from "../components/Navbar.jsx"
import Skeleton from "../components/Skeleton.jsx"
import Reveal from "../components/Reveal.jsx"

const DIFFICULTY_STYLES = {
  facil: { background: "#14532d", color: "#86efac" },
  moderado: { background: "#713f12", color: "#fde68a" },
  dificil: { background: "#7c2d12", color: "#fdba74" },
  experto: { background: "#450a0a", color: "#fca5a5" }
}

function RouteCard({ route }) {
  return (
    <Link to={"/routes/" + route.id} style={{textDecoration: "none"}}>
      <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", overflow: "hidden", transition: "transform 0.2s ease, border-color 0.2s ease"}}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#F2854D" }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1A3050" }}
      >
        {route.photos && route.photos.length > 0 ? (
          <img src={route.photos[0].url} alt={route.title} style={{width: "100%", height: "140px", objectFit: "cover"}} />
        ) : (
          <div style={{width: "100%", height: "140px", background: "#050B18", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <span style={{color: "#1A3050", fontSize: "32px"}}>?</span>
          </div>
        )}
        <div style={{padding: "14px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px"}}>
            <h3 style={{color: "white", fontWeight: "500", margin: 0, fontSize: "14px"}}>{route.title}</h3>
            <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "500"}}>{route.difficulty}</span>
          </div>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#2A4A6A"}}>
            <span>{route.distanceKm} km por {route.user.username}</span>
            <span>{route._count.completions} completaciones</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function RouteCardSkeleton() {
  return (
    <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", overflow: "hidden"}}>
      <Skeleton height="140px" borderRadius="0" />
      <div style={{padding: "14px"}}>
        <Skeleton height="14px" width="68%" style={{marginBottom: "12px"}} />
        <Skeleton height="12px" width="92%" />
      </div>
    </div>
  )
}

function Home() {
  const { isAuthenticated, user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [popular, setPopular] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [feed, setFeed] = useState([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data)).catch(() => {})
    api.get("/routes/popular").then((res) => setPopular(res.data.routes)).catch(() => {})
    api.get("/routes/featured").then((res) => setFeatured(res.data)).catch(() => {})
    api.get("/ranking?limit=3").then((res) => setTopUsers(res.data.ranking)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    setFeedLoading(true)
    api.get("/routes/feed").then((res) => setFeed(res.data.routes)).catch(() => {}).finally(() => setFeedLoading(false))
  }, [isAuthenticated])

  const heroImage = featured && featured.route && featured.route.photos && featured.route.photos.length > 0
    ? featured.route.photos[0].url
    : null

  return (
    <div style={{minHeight: "100vh", background: "#050B18"}}>
      <Navbar />

      <div style={{
        position: "relative",
        minHeight: "360px",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundImage: heroImage ? `url(${heroImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: heroImage
            ? "linear-gradient(180deg, rgba(5,11,24,0.55) 0%, rgba(5,11,24,0.75) 55%, #050B18 100%)"
            : "linear-gradient(180deg, rgba(5,11,24,0.2) 0%, #050B18 100%)"
        }} />

        <div className="max-w-5xl mx-auto px-4" style={{position: "relative", width: "100%", paddingTop: "48px", paddingBottom: "32px"}}>
          {isAuthenticated ? (
            <>
              <p style={{color: "#eab308", fontSize: "13px", letterSpacing: "2px", fontWeight: "500", margin: "0 0 10px"}}>BIENVENIDO DE VUELTA</p>
              <h2 style={{color: "white", fontSize: "36px", fontWeight: "500", margin: "0 0 6px", letterSpacing: "-1px"}}>{user.username}</h2>
              <p style={{color: "#9FB4CC", fontSize: "15px", margin: "0 0 20px"}}>Listo para tu proxima aventura?</p>
            </>
          ) : (
            <>
              <p style={{color: "#eab308", fontSize: "13px", letterSpacing: "2px", fontWeight: "500", margin: "0 0 12px"}}>PLATAFORMA PARA SENDERISTAS</p>
              <h1 style={{color: "white", fontSize: "48px", fontWeight: "500", margin: "0 0 10px", letterSpacing: "-2px"}}>ARVENTRA</h1>
              <p style={{color: "#9FB4CC", fontSize: "16px", margin: "0 0 20px"}}>Descubre, comparte y revive rutas de senderismo</p>
            </>
          )}

          <div style={{display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center"}}>
            {isAuthenticated ? (
              <>
                <Link to="/routes" style={{background: "#F2854D", color: "white", padding: "12px 26px", borderRadius: "12px", fontWeight: "500", fontSize: "15px", textDecoration: "none"}}>Explorar rutas</Link>
                <Link to="/routes/create" style={{border: "1px solid rgba(255,255,255,0.25)", color: "#D8E3F0", padding: "12px 26px", borderRadius: "12px", fontSize: "15px", textDecoration: "none"}}>Publicar ruta</Link>
              </>
            ) : (
              <>
                <Link to="/register" style={{background: "#F2854D", color: "white", padding: "12px 26px", borderRadius: "12px", fontWeight: "500", fontSize: "15px", textDecoration: "none"}}>Crear cuenta</Link>
                <Link to="/login" style={{border: "1px solid rgba(255,255,255,0.25)", color: "#D8E3F0", padding: "12px 26px", borderRadius: "12px", fontSize: "15px", textDecoration: "none"}}>Iniciar sesion</Link>
              </>
            )}

           {isAuthenticated && feed.length > 0 && (
              <button
                onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}
                style={{marginLeft: "auto", background: "rgba(13,31,53,0.85)", border: "1px solid #1A3050", borderRadius: "12px", padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"}}
              >
                <span style={{fontSize: "18px"}}>🗺️</span>
                <span style={{color: "white", fontSize: "13px"}}>{feed.length} ruta{feed.length !== 1 ? "s" : ""} nueva{feed.length !== 1 ? "s" : ""} de gente que sigues</span>
              </button>
            )}
          </div>

          {featured && featured.route && (
            <div style={{marginTop: "24px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap"}}>
              <span style={{background: "#F2854D", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "500"}}>⭐ DESTACADA</span>
              <Link to={"/routes/" + featured.route.id} style={{color: "white", fontSize: "14px", fontWeight: "500", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)"}}>
                {featured.route.title}
              </Link>
              <span style={{color: "#9FB4CC", fontSize: "13px"}}>🔥 {featured.completionsThisWeek} esta semana</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {isAuthenticated && (
          <Reveal>
            <div id="feed" style={{marginBottom: "56px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <h2 style={{color: "white", fontSize: "20px", fontWeight: "500", margin: 0}}>Tu feed</h2>
                <Link to="/routes" style={{color: "#FFB88A", fontSize: "14px", textDecoration: "none"}}>Explorar todas</Link>
              </div>
              {feedLoading ? (
                <div style={{display: "flex", gap: "16px", overflowX: "auto"}}>
                  {[0, 1, 2].map((index) => (
                    <div key={index} style={{minWidth: "260px"}}><RouteCardSkeleton /></div>
                  ))}
                </div>
              ) : feed.length > 0 ? (
                <div style={{display: "flex", gap: "16px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "8px"}}>
                  {feed.map((route) => (
                    <div key={route.id} style={{minWidth: "260px", maxWidth: "260px", scrollSnapAlign: "start"}}>
                      <RouteCard route={route} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "40px", textAlign: "center"}}>
                  <p style={{color: "#6B8CAE", fontSize: "15px", margin: "0 0 16px"}}>Aun no sigues a ningun senderista.</p>
                  <Link to="/ranking" style={{background: "#F2854D", color: "white", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", textDecoration: "none", fontWeight: "500"}}>Descubrir senderistas</Link>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {popular.length > 0 && (
          <Reveal>
            <div style={{marginBottom: "56px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <h2 style={{color: "white", fontSize: "20px", fontWeight: "500", margin: 0}}>Rutas populares</h2>
                <Link to="/routes" style={{color: "#FFB88A", fontSize: "14px", textDecoration: "none"}}>Ver todas</Link>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px"}}>
                {popular.map((route) => <RouteCard key={route.id} route={route} />)}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div style={{display: "grid", gridTemplateColumns: isAuthenticated ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "56px"}}>
            <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "20px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                <h2 style={{color: "white", fontSize: "16px", fontWeight: "500", margin: 0}}>Top senderistas</h2>
                <Link to="/ranking" style={{color: "#FFB88A", fontSize: "13px", textDecoration: "none"}}>Ver ranking</Link>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                {topUsers.map((u) => (
                  <Link key={u.id} to={"/profile/" + u.username} style={{display: "flex", alignItems: "center", gap: "10px", textDecoration: "none"}}>
                    <span style={{color: u.position === 1 ? "#eab308" : "#2A4A6A", fontSize: "13px", fontWeight: "500", minWidth: "24px"}}>#{u.position}</span>
                    <div style={{width: "32px", height: "32px", borderRadius: "50%", background: "#F2854D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "500", color: "white"}}>{u.username[0].toUpperCase()}</div>
                    <span style={{color: "#6B8CAE", fontSize: "14px", flex: 1}}>{u.username}</span>
                    <span style={{color: "#eab308", fontSize: "13px", fontWeight: "500"}}>{u.points} pts</span>
                  </Link>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "20px"}}>
                <h2 style={{color: "white", fontSize: "16px", fontWeight: "500", margin: "0 0 16px"}}>Por que ARVENTRA?</h2>
                <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                  {[
                    { title: "Mapas interactivos", desc: "Ve exactamente donde empieza cada ruta", color: "#FFB88A" },
                    { title: "Diario de aventuras", desc: "Guarda tus recuerdos, fotos e historias", color: "#7BC47F" },
                    { title: "Comunidad activa", desc: "Conecta con senderistas de todo el mundo", color: "#eab308" }
                  ].map((f) => (
                    <div key={f.title} style={{display: "flex", gap: "12px", alignItems: "flex-start"}}>
                      <div style={{width: "8px", height: "8px", borderRadius: "50%", background: f.color, marginTop: "5px", flexShrink: 0}} />
                      <div>
                        <p style={{color: "white", fontSize: "13px", fontWeight: "500", margin: "0 0 2px"}}>{f.title}</p>
                        <p style={{color: "#4A6480", fontSize: "12px", margin: 0}}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {stats && (
          <Reveal>
            <div style={{display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", padding: "16px", borderTop: "1px solid #1A3050"}}>
              {[
                { value: stats.users, label: "senderistas" },
                { value: stats.routes, label: "rutas publicadas" },
                { value: stats.completions, label: "rutas completadas" }
              ].map((stat) => (
                <div key={stat.label} style={{textAlign: "center"}}>
                  <span style={{color: "#eab308", fontSize: "20px", fontWeight: "500"}}>{stat.value}</span>
                  <span style={{color: "#4A6480", fontSize: "13px", marginLeft: "6px"}}>{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>
        <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>
        <span style={{color: "#1A3050", margin: "0 10px"}}>·</span>
        <Link to="/terms" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Terminos y Condiciones</Link>
      </div>
    </div>
  )
}

export default Home
