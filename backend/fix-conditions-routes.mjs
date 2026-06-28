import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")
c = c.replace(
  "import ratingsRoutes from './routes/ratings.routes.js'",
  "import ratingsRoutes from './routes/ratings.routes.js'\nimport conditionsRoutes from './routes/conditions.routes.js'"
)
c = c.replace(
  "app.use('/api/routes', ratingsRoutes)",
  "app.use('/api/routes', ratingsRoutes)\napp.use('/api/routes', conditionsRoutes)"
)
writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
