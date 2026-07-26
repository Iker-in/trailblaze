import { writeFileSync } from "fs"

const content = `function SectionError({ message = "No se pudo cargar esta seccion", onRetry }) {
  return (
    <div style={{background: "#0D1F35", border: "1px solid #1A3050", borderRadius: "14px", padding: "32px", textAlign: "center"}}>
      <p style={{color: "#6B8CAE", fontSize: "14px", margin: "0 0 14px"}}>⚠️ {message}</p>
      <button onClick={onRetry} style={{background: "#F2854D", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", cursor: "pointer", fontWeight: "500"}}>
        Reintentar
      </button>
    </div>
  )
}

export default SectionError
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/SectionError.jsx", content)
console.log("SectionError.jsx creado")
