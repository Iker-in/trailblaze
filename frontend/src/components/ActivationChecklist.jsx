function ActivationChecklist({ profile, onDismiss }) {
  const steps = [
    { done: Boolean(profile.bio), label: "Completa tu bio", icon: "📝" },
    { done: profile._count.following > 0, label: "Sigue a tu primer senderista", icon: "🧭" },
    { done: profile._count.routes > 0, label: "Publica tu primera ruta", icon: "🗺️" },
    { done: profile._count.completions > 0, label: "Completa tu primera ruta", icon: "🏔️" }
  ]
  const completedCount = steps.filter((s) => s.done).length

  return (
    <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "20px", marginBottom: "32px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px"}}>
        <div>
          <h3 style={{color: "white", fontSize: "15px", fontWeight: "500", margin: "0 0 4px"}}>Primeros pasos en ARVENTRA</h3>
          <p style={{color: "#4A6480", fontSize: "12px", margin: 0}}>{completedCount} de {steps.length} completados</p>
        </div>
        <button onClick={onDismiss} style={{background: "none", border: "none", color: "#4A6480", fontSize: "13px", cursor: "pointer"}}>Ocultar</button>
      </div>
      <div style={{height: "6px", background: "#050B18", borderRadius: "3px", overflow: "hidden", marginBottom: "16px"}}>
        <div style={{height: "100%", width: (completedCount / steps.length * 100) + "%", background: "#F2854D", transition: "width 0.4s ease"}} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        {steps.map((step) => (
          <div key={step.label} style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <span style={{fontSize: "16px", opacity: step.done ? 1 : 0.4}}>{step.done ? "✅" : step.icon}</span>
            <span style={{color: step.done ? "#4A6480" : "#D8E3F0", fontSize: "13px", textDecoration: step.done ? "line-through" : "none"}}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivationChecklist
