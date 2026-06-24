import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/components/NotificationBell.jsx", "utf8")
c = c.replace(
  `  const handleNotificationClick = (n) => {
    setOpen(false)
    if (n.link) {
      const path = n.link.startsWith('/') ? n.link : '/' + n.link
      navigate(path)
    }
  }`,
  `  const handleNotificationClick = (n) => {
    setOpen(false)
    if (n.link) navigate(n.link)
  }`
)
writeFileSync("C:/proyectos/trailblaze/frontend/src/components/NotificationBell.jsx", c)
console.log("Revertido")
