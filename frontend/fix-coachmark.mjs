import { writeFileSync } from "fs"

const content = `import { useState, useEffect } from "react"

function Coachmark({ id, text, children }) {
  const storageKey = "arventra_coachmark_" + id
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => setVisible(true), 700)
      return () => clearTimeout(t)
    }
  }, [storageKey])

  const dismiss = () => {
    localStorage.setItem(storageKey, "true")
    setVisible(false)
  }

  return (
    <div style={{position: "relative", display: "inline-block"}}>
      {children}
      {visible && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 14px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#F2854D",
          color: "white",
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "13px",
          width: "210px",
          textAlign: "center",
          zIndex: 50,
          boxShadow: "0 10px 24px rgba(0,0,0,0.4)"
        }}>
          <div style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "12px",
            height: "12px",
            background: "#F2854D"
          }} />
          {text}
          <button onClick={dismiss} style={{display: "block", margin: "10px auto 0", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "6px", padding: "5px 14px", color: "white", fontSize: "12px", cursor: "pointer"}}>
            Entendido
          </button>
        </div>
      )}
    </div>
  )
}

export default Coachmark
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/Coachmark.jsx", content)
console.log("Coachmark.jsx creado")
