import { useState, useEffect } from "react"
import { updateCompletion, uploadCompletionPhoto } from "../services/routes.service.js"

const MOODS = [
  { value: "increible", label: "Increible", emoji: "🤩" },
  { value: "desafiante", label: "Desafiante", emoji: "💪" },
  { value: "relajante", label: "Relajante", emoji: "😌" },
  { value: "inspiradora", label: "Inspiradora", emoji: "✨" },
  { value: "agotadora", label: "Agotadora", emoji: "🥵" }
]

function SaveMemoryModal({ completionId, onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t) }, [])
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [mood, setMood] = useState(null)
  const [photos, setPhotos] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - photos.length)
    setPhotos((prev) => [...prev, ...files])
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      if (title || notes || mood) {
        await updateCompletion(completionId, {
          title: title || undefined,
          notes: notes || undefined,
          mood: mood || undefined
        })
      }
      for (const file of photos) {
        await uploadCompletionPhoto(completionId, file)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar tu aventura")
      setSaving(false)
    }
  }

  return (
    <div style={{position: "fixed", inset: 0, background: "rgba(5,11,24,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px", opacity: visible ? 1 : 0, transition: "opacity 0.3s ease"}}>
      <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "16px", padding: "24px", maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto"}}>
        <h2 style={{color: "white", fontSize: "18px", fontWeight: "500", margin: "0 0 4px"}}>✨ Guarda este momento</h2>
        <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 20px"}}>¿Como fue tu aventura? (opcional)</p>

        <input
          type="text"
          placeholder="Titulo de la aventura, ej: Mi primera subida al Nevado"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{width: "100%", background: "#050B18", border: "1px solid #1A3050", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box"}}
        />

        <textarea
          placeholder="Notas personales, ej: Nos toco una tormenta inesperada, pero llegamos a la cima justo al amanecer."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{width: "100%", background: "#050B18", border: "1px solid #1A3050", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit"}}
        />

        <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 8px"}}>¿Como te sentiste?</p>
        <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px"}}>
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(mood === m.value ? null : m.value)}
              style={{
                background: mood === m.value ? "#F2854D" : "#050B18",
                color: mood === m.value ? "white" : "#6B8CAE",
                border: "1px solid " + (mood === m.value ? "#F2854D" : "#1A3050"),
                borderRadius: "20px", padding: "8px 14px", fontSize: "13px", cursor: "pointer"
              }}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 8px"}}>📸 Fotos ({photos.length}/10)</p>
        <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} disabled={photos.length >= 10} style={{color: "#6B8CAE", fontSize: "13px", marginBottom: "16px"}} />

        {error && <p style={{color: "#fca5a5", fontSize: "13px", margin: "0 0 12px"}}>{error}</p>}

        <div style={{display: "flex", gap: "10px", justifyContent: "flex-end"}}>
          <button onClick={onClose} disabled={saving} style={{background: "none", border: "1px solid #1A3050", color: "#6B8CAE", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", cursor: "pointer"}}>
            Omitir
          </button>
          <button onClick={handleSave} disabled={saving} style={{background: "#F2854D", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "500", fontSize: "14px", cursor: "pointer", opacity: saving ? 0.6 : 1}}>
            {saving ? "Guardando..." : "Guardar recuerdo"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveMemoryModal
