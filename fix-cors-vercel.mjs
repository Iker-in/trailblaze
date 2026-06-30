import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")
c = c.replace(
  `const allowedOrigins = [
  'http://localhost:5173',
  'https://localhost',
  'capacitor://localhost',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if ((!origin && !isProduction) || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('CORS no permitido'))
  },`,
  `const allowedOrigins = [
  'http://localhost:5173',
  'https://localhost',
  'capacitor://localhost',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if ((!origin && !isProduction) || allowedOrigins.includes(origin)) return callback(null, true)
    if (origin && origin.endsWith('.vercel.app')) return callback(null, true)
    callback(new Error('CORS no permitido'))
  },`
)
writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
