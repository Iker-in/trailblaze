import { readFileSync, writeFileSync } from "fs"

// Actualizar variables CSS
let css = readFileSync("C:/proyectos/trailblaze/frontend/src/index.css", "utf8")
css = css.replace("--tb-purple: #f97316;", "--tb-purple: #f97316;")
css = css.replace("--tb-yellow: #fb923c;", "--tb-yellow: #fb923c;")
css = css.replace("--tb-pink: #f43f5e;", "--tb-pink: #f43f5e;")
css = css.replace("--tb-dark: #050B18;", "--tb-dark: #050B18;")
css = css.replace("--tb-surface: #0D1F35;", "--tb-surface: #0D1F35;")
css = css.replace("--tb-border: #1A3050;", "--tb-border: #1A3050;")
css = css.replace("--tb-muted: #6B8CAE;", "--tb-muted: #6B8CAE;")
css = css.replace("background-color: #050B18;", "background-color: #050B18;")
writeFileSync("C:/proyectos/trailblaze/frontend/src/index.css", css)
console.log("CSS actualizado")
