import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8")

c = c.replace(
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
  }`,
  `  const handleRate = async (value) => {
    if (!isAuthenticated) return
    setRatingLoading(true)
    try {
      await api.post('/routes/' + id + '/rate', { rating: value })
      const res = await api.get('/routes/' + id + '/rating')
      setRatings(res.data)
    } catch {}
    setRatingLoading(false)
  }`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", c)
console.log("Listo")
