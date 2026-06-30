import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", "utf8")
c = c.replace(
  "    } catch (error) {\n      console.error('Error al completar ruta:', error)\n      res.status(500).json({ error: 'Error interno del servidor' })\n    }",
  `    } catch (error) {
      console.error('Error al completar ruta:', error)
      if (error.code === 'P2002') {
        // Unique constraint - crear con id diferente
        try {
          const { v4: uuidv4 } = await import('crypto')
          await prisma.routeCompletion.create({
            data: { id: uuidv4(), userId: req.userId, routeId: id, notes: req.body.notes || null, realTime: req.body.realTime ? parseInt(req.body.realTime) : null }
          })
          return res.status(201).json({ message: 'Ruta completada exitosamente' })
        } catch (e2) {
          return res.status(500).json({ error: 'Error al completar la ruta' })
        }
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }`
)
writeFileSync("C:/proyectos/trailblaze/backend/src/controllers/routes.controller.js", c)
console.log("Listo")
