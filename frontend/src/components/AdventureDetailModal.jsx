import { useState } from "react"
import { Link } from "react-router-dom"

const MOOD_EMOJIS = {
  increible: "🤩",
  desafiante: "💪",
  relajante: "😌",
  inspiradora: "✨",
  agotadora: "🥵"
}

const MOOD_LABELS = {
  increible: "Increible",
  desafiante: "Desafiante",
  relajante: "Relajante",
  inspiradora: "Inspiradora",
  agotadora: "Agotadora"
}

function AdventureDetailModal({ completion, onClose }) {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const photos = completion.photos || []
  const formattedDate = new Date(completion.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div onClick={onClose} style={{position: "fixed", inset: 0, background: "rgba(5,11,24,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"}}>
      <div onClick={(e) => e.stopPropagation()} style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "16px", maxWidth: "560px", width: "100%", maxHeight: "90vh", overflowY: "auto"}}>
        {photos.length > 0 && (
          <div style={{position: "relative"}}>
            <img src={photos[currentPhoto].url} alt="" style={{width: "100%", height: "280px", objectFit: "cover", borderRadius: "16px 16px 0 0"}} />
            {photos.length > 1 && (
              <div style={{display: "flex", gap: "8px", padding: "8px", overflowX: "auto", background: "#050B18"}}>
                {photos.map((photo, i) => (
                  <img key={i} src={photo.url} alt="" onClick={() => setCurrentPhoto(i)} style={{width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px", cursor: "pointer", border: i === currentPhoto ? "2px solid #F2854D" : "2px solid transparent", flexShrink: 0}} />
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{padding: "24px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px"}}>
            <h2 style={{color: "white", fontSize: "20px", fontWeight: "500", margin: 0}}>
              {MOOD_EMOJIS[completion.mood] ? MOOD_EMOJIS[completion.mood] + " " : "🏔️ "}
              {completion.title || completion.route.title}
            </h2>
            <button onClick={onClose} style={{background: "none", border: "none", color: "#6B8CAE", fontSize: "20px", cursor: "pointer", lineHeight: 1}}>✕</button>
          </div>
          <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 4px"}}>{formattedDate}</p>
          {completion.title && <p style={{color: "#4A6480", fontSize: "13px", margin: "0 0 16px"}}>{completion.route.title}</p>}

          <div style={{display: "flex", gap: "16px", fontSize: "13px", color: "#4A6480", marginBottom: "16px", flexWrap: "wrap"}}>
            <span>{completion.route.distanceKm} km</span>
            {completion.route.elevationM && <span>{completion.route.elevationM} m</span>}
            {completion.realTime && <span>{completion.realTime} min</span>}
            {completion.mood && <span>{MOOD_EMOJIS[completion.mood]} {MOOD_LABELS[completion.mood]}</span>}
          </div>

          {completion.notes && (
            <p style={{color: "#6B8CAE", fontSize: "14px", fontStyle: "italic", lineHeight: "1.6", margin: "0 0 20px", borderLeft: "3px solid #1A3050", paddingLeft: "14px"}}>
              "{completion.notes}"
            </p>
          )}

          <Link to={"/routes/" + completion.route.id} style={{color: "#FFB88A", fontSize: "13px", fontWeight: "500", textDecoration: "none"}}>Ver ruta →</Link>
        </div>
      </div>
    </div>
  )
}

export default AdventureDetailModal
