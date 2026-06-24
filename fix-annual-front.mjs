import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Ranking.jsx", "utf8")

// Añadir estado anual
c = c.replace(
  '  const [loadingFriends, setLoadingFriends] = useState(false)',
  `  const [loadingFriends, setLoadingFriends] = useState(false)
  const [annualRanking, setAnnualRanking] = useState([])
  const [loadingAnnual, setLoadingAnnual] = useState(false)
  const currentYear = new Date().getFullYear()`
)

// Añadir fetch anual
c = c.replace(
  `  }, [tab, isAuthenticated])`,
  `  }, [tab, isAuthenticated])

  useEffect(() => {
    if (tab === 'anual' && annualRanking.length === 0) {
      setLoadingAnnual(true)
      api.get('/ranking/annual')
        .then(res => setAnnualRanking(res.data.ranking))
        .catch(console.error)
        .finally(() => setLoadingAnnual(false))
    }
  }, [tab])`
)

// Añadir botón tab anual
c = c.replace(
  `<button onClick={() => setTab("amigos")} style={tabStyle("amigos")}>👥 Entre amigos</button>`,
  `<button onClick={() => setTab("amigos")} style={tabStyle("amigos")}>👥 Entre amigos</button>
            <button onClick={() => setTab("anual")} style={tabStyle("anual")}>🏆 {currentYear}</button>`
)

// Añadir contenido tab anual antes del cierre
c = c.replace(
  `        {tab === "amigos" && (`,
  `        {tab === "anual" && (
          <>
            <p style={{color: "#6B8CAE", fontSize: "14px", marginBottom: "24px"}}>Top exploradores de {currentYear} — por rutas completadas</p>
            {loadingAnnual && <div style={{color: "#6B8CAE", textAlign: "center", padding: "48px"}}>Cargando...</div>}
            <div className="flex flex-col gap-3">
              {annualRanking.map((entry) => (
                <RankingEntry key={entry.id} entry={entry} currentUser={currentUser} />
              ))}
              {!loadingAnnual && annualRanking.length === 0 && (
                <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "40px", textAlign: "center"}}>
                  <p style={{color: "#6B8CAE", fontSize: "15px", margin: 0}}>Nadie ha completado rutas este año todavia.</p>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "amigos" && (`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Ranking.jsx", c)
console.log("Listo")
