import { writeFileSync } from "fs"

const content = `import { useEffect, useRef, useState } from "react"

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease " + delay + "ms, transform 0.6s ease " + delay + "ms"
      }}
    >
      {children}
    </div>
  )
}

export default Reveal
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/Reveal.jsx", content)
console.log("Reveal.jsx creado")
