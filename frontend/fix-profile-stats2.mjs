import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

c = c.replace(
  "          {tab === 'favorites' && favorites.length === 0",
  `          {tab === 'stats' && statsLoading && <div style={{textAlign: 'center', padding: '40px', color: '#6B8CAE'}}>Cargando estadisticas...</div>}
          {tab === 'stats' && !statsLoading && stats && stats.hidden && <div style={{background: '#0D1F35', borderRadius: '14px', padding: '32px', textAlign: 'center', color: '#6B8CAE'}}>Este usuario tiene sus estadisticas privadas.</div>}
          {tab === 'stats' && !statsLoading && stats && !stats.hidden && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {isOwnProfile && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#6B8CAE', fontSize: '13px'}}>Estadisticas publicas</span>
                  <button onClick={() => {
                    api.patch('/users/me/stats-visibility', { statsPublic: !stats.statsPublic })
                      .then(() => setStats(s => ({...s, statsPublic: !s.statsPublic})))
                      .catch(() => {})
                  }} style={{background: stats.statsPublic ? '#f97316' : '#1A3050', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '500'}}>
                    {stats.statsPublic ? 'Publicas' : 'Privadas'}
                  </button>
                </div>
              )}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {[
                  { label: 'km totales', value: stats.totalKm, color: '#f97316' },
                  { label: 'metros subidos', value: stats.totalElevation + 'm', color: '#fb923c' },
                  { label: 'rutas completadas', value: stats.totalCompletions, color: '#f43f5e' },
                  { label: 'rutas faciles', value: stats.byDifficulty?.facil || 0, color: '#86efac' },
                  { label: 'rutas moderadas', value: stats.byDifficulty?.moderado || 0, color: '#fde68a' },
                  { label: 'rutas expertas', value: (stats.byDifficulty?.dificil || 0) + (stats.byDifficulty?.experto || 0), color: '#fca5a5' }
                ].map(s => (
                  <div key={s.label} style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
                    <p style={{color: s.color, fontSize: '28px', fontWeight: '500', margin: '0 0 4px'}}>{s.value}</p>
                    <p style={{color: '#4A6480', fontSize: '12px', margin: 0}}>{s.label}</p>
                  </div>
                ))}
              </div>
              {stats.longestRoute && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px'}}>
                  <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 4px'}}>Ruta mas larga</p>
                  <p style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: '0 0 2px'}}>{stats.longestRoute.title}</p>
                  <p style={{color: '#f97316', fontSize: '13px', margin: 0}}>{stats.longestRoute.distanceKm} km</p>
                </div>
              )}
              {stats.highestElevation && (
                <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '12px', padding: '16px'}}>
                  <p style={{color: '#6B8CAE', fontSize: '12px', margin: '0 0 4px'}}>Mayor elevacion</p>
                  <p style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: '0 0 2px'}}>{stats.highestElevation.title}</p>
                  <p style={{color: '#fb923c', fontSize: '13px', margin: 0}}>{stats.highestElevation.elevationM} m</p>
                </div>
              )}
            </div>
          )}
          {tab === 'favorites' && favorites.length === 0`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
console.log("Listo parte 2")
