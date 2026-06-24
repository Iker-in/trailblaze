import { readFileSync, writeFileSync } from "fs"
let c = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", "utf8")

// Quitar el useEffect de stats de donde está
const statsEffect = `  useEffect(() => {
    if (tab === 'stats' && !stats) {
      setStatsLoading(true)
      api.get('/users/' + username + '/stats')
        .then(res => setStats(res.data))
        .catch(() => {})
        .finally(() => setStatsLoading(false))
    }
  }, [tab, username])`

c = c.replace(statsEffect, "")

// Ponerlo después del useEffect de follow status
c = c.replace(
  "  }, [profile])\n",
  `  }, [profile])

${statsEffect}
`
)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/Profile.jsx", c)
console.log("Listo")
