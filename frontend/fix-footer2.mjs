import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8")
// Insertar antes del último </div></div>)
const lastPart = `      </div>
    </div>
  )
}
export default Home`
const withFooter = `      <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>
        <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>
      </div>
      </div>
    </div>
  )
}
export default Home`
c = c.slice(0, c.lastIndexOf(lastPart)) + withFooter
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", c)
console.log("Incluye privacy:", c.includes("privacy"))
