import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")

// Fix 1: Limitar tamaño del body
c = c.replace(
  "app.use(express.json())",
  "app.use(express.json({ limit: '10kb' }))"
)

// Fix 2: Morgan en produccion
c = c.replace(
  "app.use(morgan('dev'))",
  "app.use(morgan(isProduction ? 'combined' : 'dev'))"
)

// Fix 3: Health check sin info interna
c = c.replace(
  "'TrailBlaze API funcionando'",
  "'OK'"
)

// Fix 4: CORS más estricto en produccion
c = c.replace(
  "    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)",
  "    if ((!origin && !isProduction) || allowedOrigins.includes(origin)) return callback(null, true)"
)

// Fix 5: Rate limiting más estricto
c = c.replace(
  "  max: 100,",
  "  max: 60,"
)

writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
