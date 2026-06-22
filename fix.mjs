import { readFileSync, writeFileSync } from 'fs'
let c = readFileSync('src/pages/Home.jsx', 'utf8')
c = c.replace("import { useState, useEffect } from 'react'", "import { useState, useEffect } from 'react'\nimport { Link } from 'react-router-dom'")
c = c.replace(/<a href="([^"]+)"([^>]*)>/g, '<Link to="$1"$2>')
c = c.replace(/<a href={'\/routes\/' \+ route\.id}([^>]*)>/g, '<Link to={"/routes/" + route.id}$1>')
c = c.replace(/<a href={'\/' \+ [^}]+}([^>]*)>/g, '<Link to={$1}>')
c = c.replace(/<\/a>/g, '</Link>')
writeFileSync('src/pages/Home.jsx', c)
console.log('Listo')
