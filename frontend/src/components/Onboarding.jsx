import { useState } from "react"

const slides = [
  { emoji: "🏔️", title: "Revive cada aventura", desc: "ARVENTRA es tu bitacora personal de exploracion. Guarda tus rutas, tus fotos y los momentos que quieres recordar para siempre.", color: "#FFB88A" },
  { emoji: "📖", title: "Nunca olvides un momento", desc: "Cada ruta completada se convierte en un recuerdo: titulo, notas, fotos, el clima de ese dia. Todo queda guardado para revivirlo cuando quieras.", color: "#7BC47F" },
  { emoji: "🧭", title: "Explora sin perderte", desc: "Graba tu recorrido en tiempo real, comparte tu ubicacion con quien confies, y descubre rutas de otros senderistas cerca de ti.", color: "#FFB88A" }
]

function Onboarding({ onFinish }) {
  const [current, setCurrent] = useState(0)
  const slide = slides[current]

  const handleNext = () => {
    if (current < slides.length - 1) setCurrent(current + 1)
    else { localStorage.setItem("arventra_onboarding_done", "true"); onFinish() }
  }

  const handleSkip = () => {
    localStorage.setItem("arventra_onboarding_done", "true")
    onFinish()
  }

  return (
    <div style={{position: "fixed", inset: 0, background: "#050B18", zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px"}}>
      <button onClick={handleSkip} style={{position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#4A6480", fontSize: "14px", cursor: "pointer"}}>Omitir</button>
      <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: "340px"}}>
        <div style={{fontSize: "80px", marginBottom: "32px"}}>{slide.emoji}</div>
        <h1 style={{color: "white", fontSize: "26px", fontWeight: "500", margin: "0 0 16px"}}>{slide.title}</h1>
        <p style={{color: "#6B8CAE", fontSize: "16px", lineHeight: "1.6", margin: 0}}>{slide.desc}</p>
      </div>
      <div style={{width: "100%", maxWidth: "340px"}}>
        <div style={{display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px"}}>
          {slides.map((_, i) => (
            <div key={i} style={{width: i === current ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? slide.color : "#1A3050", transition: "all 0.3s"}} />
          ))}
        </div>
        <button onClick={handleNext} style={{width: "100%", background: slide.color, color: "white", border: "none", borderRadius: "14px", padding: "16px", fontSize: "16px", fontWeight: "500", cursor: "pointer"}}>
          {current < slides.length - 1 ? "Siguiente" : "Comenzar mi bitacora"}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
