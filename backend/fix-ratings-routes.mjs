import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")
c = c.replace(
  "import trackingRoutes from './routes/tracking.routes.js'",
  "import trackingRoutes from './routes/tracking.routes.js'\nimport ratingsRoutes from './routes/ratings.routes.js'"
)
c = c.replace(
  "app.use('/api/tracking', trackingRoutes)",
  "app.use('/api/tracking', trackingRoutes)\napp.use('/api/routes', ratingsRoutes)"
)
writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
