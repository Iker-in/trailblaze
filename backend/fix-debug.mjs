import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/index.js", "utf8")
c = c.replace(
  `app.get('/api/debug-db', async (req, res) => {
  const constraints = await prisma.$queryRawUnsafe(\`SELECT conname FROM pg_constraint WHERE conrelid = 'route_completions'::regclass AND contype = 'u'\`)
  res.json({ dbUrl: process.env.DATABASE_URL?.split('@')[1], constraints })
})`,
  `app.get('/api/debug-db', async (req, res) => {
  try {
    const constraints = await prisma.$queryRawUnsafe("SELECT conname FROM pg_constraint WHERE conrelid = 'route_completions'::regclass AND contype = 'u'")
    res.json({ dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'no definida', directUrl: process.env.DIRECT_URL ? process.env.DIRECT_URL.split('@')[1] : 'no definida', constraints })
  } catch (e) {
    res.json({ error: e.message, dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'no definida' })
  }
})`
)
writeFileSync("C:/proyectos/trailblaze/backend/src/index.js", c)
console.log("Listo")
