import { writeFileSync } from "fs"

const content = `function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style = {} }) {
  return <div className="arv-skeleton" style={{ width, height, borderRadius, ...style }} />
}

export default Skeleton
`

writeFileSync("C:/proyectos/trailblaze/frontend/src/components/Skeleton.jsx", content)
console.log("Skeleton.jsx creado")
