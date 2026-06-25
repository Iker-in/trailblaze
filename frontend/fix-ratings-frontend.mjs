import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

// Añadir estado de ratings
c = c.replace(
  "  const [favoriteLoading, setFavoriteLoading] = useState(false)",
  `  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [ratings, setRatings] = useState({ thumbsUp: 0, thumbsDown: 0, userRating: null })
  const [ratingLoading, setRatingLoading] = useState(false)`
)

// Cargar ratings al cargar la ruta
c = c.replace(
  "      if (isAuthenticated) {",
  `      const ratingRes = await api.get('/routes/' + id + '/rating')
      setRatings(ratingRes.data)
      if (isAuthenticated) {`
)

// Añadir función handleRate
c = c.replace(
  "  const handleShare = () => {",
  `  const handleRate = async (value) => {
    if (!isAuthenticated) return
    setRatingLoading(true)
    try {
      const res = await api.post('/routes/' + id + '/rate', { rating: value })
      const newRating = res.data.rating
      setRatings(prev => {
        const wasUp = prev.userRating === 1
        const wasDown = prev.userRating === -1
        return {
          thumbsUp: value === 1 ? (newRating === null ? prev.thumbsUp - 1 : prev.thumbsUp + (wasUp ? 0 : 1)) : prev.thumbsUp - (wasUp ? 1 : 0),
          thumbsDown: value === -1 ? (newRating === null ? prev.thumbsDown - 1 : prev.thumbsDown + (wasDown ? 0 : 1)) : prev.thumbsDown - (wasDown ? 1 : 0),
          userRating: newRating
        }
      })
    } catch {}
    setRatingLoading(false)
  }

  const handleShare = () => {`
)

// Añadir botones de rating después del botón compartir
c = c.replace(
  "              <button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer'}}>🔗 Compartir ruta</button>",
  `              <button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer'}}>🔗 Compartir ruta</button>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <button onClick={() => handleRate(1)} disabled={ratingLoading || !isAuthenticated} style={{background: ratings.userRating === 1 ? '#14532d' : '#0D1F35', color: ratings.userRating === 1 ? '#86efac' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', cursor: isAuthenticated ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  👍 {ratings.thumbsUp}
                </button>
                <button onClick={() => handleRate(-1)} disabled={ratingLoading || !isAuthenticated} style={{background: ratings.userRating === -1 ? '#450a0a' : '#0D1F35', color: ratings.userRating === -1 ? '#fca5a5' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', cursor: isAuthenticated ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  👎 {ratings.thumbsDown}
                </button>
              </div>`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
