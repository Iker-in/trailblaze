import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", "utf8")
c = c.replace(
  "}\nexport default Home",
  `}
export default Home`
)
// Añadir footer antes del último return closing
c = c.replace(
  `      </div>
    </div>
  )
}
export default Home`,
  `      <div style={{textAlign: "center", padding: "20px", borderTop: "1px solid #1A3050", marginTop: "20px"}}>
        <Link to="/privacy" style={{color: "#4A6480", fontSize: "12px", textDecoration: "none"}}>Politica de Privacidad</Link>
      </div>
      </div>
    </div>
  )
}
export default Home`
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Home.jsx", c)
console.log("Listo:", c.includes("privacy"))
