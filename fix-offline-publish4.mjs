import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/services/api.js", "utf8")

c = c.replace(
  `      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {`,
  `      } catch (refreshError) {
        processQueue(refreshError, null)
        // Si es error de red (sin internet), no cerrar sesion
        if (!refreshError.response) {
          return Promise.reject(refreshError)
        }
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/#/login'
        return Promise.reject(refreshError)
      } finally {`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/services/api.js", c)
console.log("Listo")
