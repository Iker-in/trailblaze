import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api.js"
import useAuthStore from "../store/authStore.js"

function DeleteAccountModal({ onClose }) {
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleDelete = async () => {
    setDeleting(true)
    setError("")
    try {
      await api.delete("/users/me")
      logout()
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar la cuenta")
      setDeleting(false)
    }
  }

  return (
    <div style={{position: "fixed", inset: 0, background: "rgba(5,11,24,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"}}>
      <div style={{background: "#0D1F35", border: "1px solid #f43f5e", borderRadius: "16px", padding: "24px", maxWidth: "420px", width: "100%"}}>
        <h2 style={{color: "white", fontSize: "18px", fontWeight: "500", margin: "0 0 12px"}}>⚠️ Eliminar cuenta</h2>
        <p style={{color: "#6B8CAE", fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px"}}>
          Esta accion es irreversible. Se eliminaran permanentemente tu perfil, tus rutas, tus completaciones, tus fotos, tus seguidores y todo tu historial de aventuras.
        </p>
        <p style={{color: "#6B8CAE", fontSize: "13px", margin: "0 0 8px"}}>
          Escribe <strong style={{color: "white"}}>ELIMINAR</strong> para confirmar:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          style={{width: "100%", background: "#050B18", border: "1px solid #1A3050", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box"}}
        />
        {error && <p style={{color: "#fca5a5", fontSize: "13px", margin: "0 0 12px"}}>{error}</p>}
        <div style={{display: "flex", gap: "10px", justifyContent: "flex-end"}}>
          <button onClick={onClose} disabled={deleting} style={{background: "none", border: "1px solid #1A3050", color: "#6B8CAE", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", cursor: "pointer"}}>
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || confirmText !== "ELIMINAR"}
            style={{background: "#f43f5e", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: "500", fontSize: "14px", cursor: "pointer", opacity: (deleting || confirmText !== "ELIMINAR") ? 0.5 : 1}}
          >
            {deleting ? "Eliminando..." : "Eliminar mi cuenta"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
