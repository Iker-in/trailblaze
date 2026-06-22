# ARVENTRA — HANDOFF DOCUMENT DEFINITIVO
*Generado para migración de contexto entre sesiones de Claude*

---

## 1. RESUMEN EJECUTIVO

**Nombre actual:** ARVENTRA
**Nombres evaluados:** TrailBlaze (original), Aventra, Arventa, Fiera
**Razón del cambio:** TrailBlaze tenía mucha competencia en tiendas de apps y como marca. ARVENTRA es original, sonoro y disponible como dominio.
**Dominio objetivo:** arventra.app (libre, pendiente de compra)

**Objetivo principal:** Plataforma web/móvil comunitaria para senderistas hispanohablantes donde los usuarios pueden descubrir, grabar, compartir y completar rutas de senderismo.

**Problema que resuelve:** Las apps de senderismo existentes (Strava, Wikiloc, AllTrails) están dominadas por inglés y no tienen una comunidad hispanohablante activa. Tampoco premian la exploración genuina — solo la distancia o el tiempo.

**Público objetivo:** Senderistas hispanohablantes de 18-45 años, desde principiantes hasta expertos, con acceso a smartphone Android o iOS.

**Visión a largo plazo:** App nativa (React Native + Expo) con GPS offline, mapas descargables, retos de exploración únicos, y una comunidad activa de senderistas de habla hispana.

---

## 2. ESTADO ACTUAL DEL PROYECTO

### COMPLETAMENTE FUNCIONAL EN PRODUCCIÓN

**Autenticación completa**
- JWT con access tokens (15min) + refresh tokens (7 días) en httpOnly cookies
- Blacklist de refresh tokens en DB (tabla `revoked_tokens`) — logout invalida el token inmediatamente
- Rate limiting en login: 5 intentos / 15 min por IP
- Rate limiting en registro: 5 registros / hora por IP
- `normalizeEmail()` en registro y forgot-password

**Recuperación de contraseña**
- Endpoint `POST /api/auth/forgot-password` — genera token UUID de 1 hora
- Endpoint `POST /api/auth/reset-password` — valida token, actualiza hash
- Envío via Resend (`onboarding@resend.dev`) — LIMITADO: solo funciona al email registrado en Resend hasta tener dominio propio
- Tabla `password_reset_tokens` con campo `used` para evitar reutilización

**Creación y gestión de rutas**
- CRUD completo: crear, ver, editar, eliminar rutas propias
- Campos: título, descripción, dificultad (4 niveles), distancia, elevación, tiempo estimado, coordenadas de inicio, fotos (hasta 5 via Cloudinary), `trackPoints` (JSON con array de coordenadas GPS)
- Sanitización XSS en título y descripción
- Validación de campos negativos en elevación y tiempo

**Sistema GPS y grabación de rutas — FUNCIONALIDAD CLAVE**
- Página `/routes/record` — grabación GPS en tiempo real con `watchPosition`
- Mapa Leaflet con Polyline que se dibuja en vivo siguiendo al usuario
- Auto-seguimiento del mapa (cámara sigue la posición actual) via componente `MapAutoCenter`
- Pausar/reanudar grabación (clearWatch + nuevo watchPosition)
- Cronómetro en tiempo real con `setInterval`
- Cálculo de distancia con fórmula Haversine en tiempo real
- Cálculo de elevación ganada usando `pos.coords.altitude`
- Indicador de precisión GPS (buena/regular/debil + metros)
- Advertencia antes de cerrar pestaña si se está grabando (`beforeunload`)
- Al terminar, guarda en `sessionStorage` los datos y redirige a `/routes/create` con todo precargado (distancia, tiempo, elevación, coordenadas, trackPoints)
- El mapa en detalle de ruta muestra el trazado real del recorrido (Polyline naranja `#f97316`)

**Sistema de fotos**
- Upload a Cloudinary desde el frontend (multipart/form-data)
- Hasta 5 fotos por ruta, con orden
- Avatares de usuario: endpoint `PATCH /api/users/me/avatar`, límite 2MB, transformación a 200x200 crop face en Cloudinary
- Avatares visibles en: perfil, ranking, comentarios

**Feed personalizado**
- `GET /api/routes/feed` — rutas de usuarios que sigues, paginado
- Se muestra en Home solo si estás autenticado
- Si no sigues a nadie, muestra mensaje con link al ranking

**Comentarios con threads**
- Paginación: 10 comentarios por página, orden DESC (más recientes primero)
- Botón "Responder" en cada comentario abre formulario anidado
- Respuestas se muestran indentadas debajo del comentario padre
- Campo `parentId` en tabla `comments` con auto-relación "CommentReplies"
- Al abrir formulario de respuesta, se oculta el formulario principal
- Paginación solo cuenta comentarios raíz (sin `parentId`)

**Sistema de favoritos**
- `POST/DELETE /api/routes/:id/favorite` — guardar/quitar
- `GET /api/routes/:id/favorite-status` — estado del botón (autenticado)
- `GET /api/users/:username/favorites` — lista de rutas guardadas
- Tab "Guardadas" en perfil de usuario
- Tabla `favorites` con unicidad [userId, routeId]

**Perfiles de usuario**
- Ver perfil propio y ajeno: stats, rutas publicadas, completadas, guardadas
- Editar bio (máx 300 caracteres)
- Subir avatar (2MB máx, recorte automático a 200x200)
- Badge de nivel visible en perfil
- Tabs: Publicadas / Completadas / Guardadas

**Sistema de niveles/badges**
- Helper `src/utils/levels.js` con función `getLevelInfo(points)`
- Componente `LevelBadge.jsx` con prop `size` (sm/md/lg)
- Niveles: Bronce Senderista (0-999), Plata Explorador (1000-1999), Oro Montañista (2000-2999), Platino Apex (3000-4999), Diamante Eléctrico (5000+)
- Visible en: perfil de usuario, ranking global

**Sistema social**
- Follow/unfollow de usuarios
- Contadores de seguidores/siguiendo en perfil
- Notificación automática al recibir un follower

**Ranking global**
- Paginado, ordenado por puntos
- Búsqueda/filtro por username integrada
- Muestra posición, avatar, username, badge de nivel, puntos, stats

**Búsqueda de usuarios**
- Componente `UserSearch.jsx` en Navbar — debounce 300ms
- Dropdown con avatar, username
- Endpoint `GET /api/users/search?q=` — IMPORTANTE: debe estar ANTES de `/:username` en las rutas

**Gamificación / Logros**
- Tabla `achievements` con criterio, puntos, descripción
- Se otorgan automáticamente via `checkAndGrantAchievements()` al crear rutas y completar
- Página `/achievements` con estado ganado/pendiente

**Notificaciones**
- Tipos: `follow`, `completion`, `comment`
- Campo `link` — al hacer clic navega a la ruta o perfil correspondiente
- Polling cada 30 segundos
- Marca como leídas al abrir el dropdown
- Componente `NotificationBell.jsx` en Navbar

**Exploración con GPS**
- Filtros: búsqueda por nombre, dificultad, distancia máxima
- Botón "Cerca de mí" — pide ubicación GPS y ordena rutas por distancia al usuario
- Muestra "X km de ti" en cada card cuando está activo

**Editar rutas**
- Página `/routes/:id/edit` — formulario precargado
- Endpoint `PATCH /api/routes/:id` — solo el autor puede editar

**PWA (Progressive Web App)**
- `manifest.json` en `/public` con nombre, colores, icono ARVENTRA
- Service Worker (`sw.js`) con cache básico (versión `arventra-v2`)
- Instalable en Android (Chrome) e iOS (Safari → Compartir → Agregar a inicio)
- Funciona en pantalla completa sin barra del navegador
- GPS funciona desde la PWA instalada
- `vercel.json` con reglas explícitas para NO reescribir manifest.json, logo.png, sw.js

**Seguridad implementada**
- Rate limiting global: 100 req / 15 min por IP
- Rate limiting comentarios: 10 / 5 min por userId
- Refresh token blacklist en DB
- Sanitización XSS
- Helmet.js para headers HTTP
- CORS configurado para múltiples orígenes
- Validación con express-validator en todos los endpoints

---

## 3. STACK TECNOLÓGICO

**Frontend:** React 18 + Vite, Tailwind CSS, React Router DOM v6, Zustand, Axios, Leaflet + react-leaflet, react-helmet-async — Deployed en Vercel

**Backend:** Node.js + Express, Prisma v6 (PINADO), JWT, bcryptjs, Multer, Cloudinary SDK, Resend, express-rate-limit, Helmet, xss — Deployed en Railway

**Base de datos:** PostgreSQL via Supabase (proyecto ID: `dakpgxziwstndprhsaxb`)

**Servicios externos:** Cloudinary (imágenes), Resend (emails, limitado sin dominio), OpenStreetMap via Leaflet (mapas, gratis)

---

## 4. ESTRUCTURA DE CARPETAS

```
trailblaze/
├── frontend/
│   ├── public/
│   │   ├── logo.png          # Logo ARVENTRA (1254x1254px, fondo transparente)
│   │   ├── manifest.json     # PWA manifest
│   │   ├── sw.js             # Service Worker cache arventra-v2
│   │   └── vercel.json       # Rewrites SPA con exclusiones de archivos estáticos
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Logo + ARVENTRA + UserSearch + NotificationBell
│       │   ├── NotificationBell.jsx
│       │   ├── LevelBadge.jsx
│       │   ├── RouteMap.jsx       # Mapa con Polyline de trackPoints
│       │   ├── UserSearch.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx           # Feed + populares + stats
│       │   ├── Routes.jsx         # Listado + filtros + cerca de mí GPS
│       │   ├── RouteDetail.jsx    # Detalle + mapa + favorito + comentarios threads
│       │   ├── CreateRoute.jsx    # Formulario + recibe datos de sessionStorage
│       │   ├── EditRoute.jsx      # Formulario precargado
│       │   ├── RecordRoute.jsx    # Grabación GPS live + mapa auto-seguimiento
│       │   ├── Profile.jsx        # Perfil + tabs (publicadas/completadas/guardadas)
│       │   ├── Ranking.jsx
│       │   ├── Achievements.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── NotFound.jsx
│       ├── services/
│       │   ├── api.js             # Axios base URL + interceptor Bearer token
│       │   ├── auth.service.js
│       │   ├── routes.service.js
│       │   ├── users.service.js   # Incluye searchUsers
│       │   └── ranking.service.js
│       ├── store/
│       │   └── authStore.js       # Zustand: user, token, isAuthenticated, login, logout
│       └── utils/
│           └── levels.js          # getLevelInfo(points)
└── backend/
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── config/
        │   ├── prisma.js
        │   └── cloudinary.js
        ├── middleware/
        │   └── auth.middleware.js
        ├── routes/
        │   ├── auth.routes.js
        │   ├── routes.routes.js   # ORDEN: /popular, /feed ANTES de /:id
        │   ├── users.routes.js    # ORDEN: /search ANTES de /:username
        │   ├── follows.routes.js
        │   ├── comments.routes.js
        │   ├── favorites.routes.js
        │   ├── photos.routes.js
        │   ├── ranking.routes.js
        │   ├── achievements.routes.js
        │   └── notifications.routes.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── routes.controller.js
        │   ├── users.controller.js
        │   ├── comments.controller.js
        │   ├── favorites.controller.js
        │   └── follows.controller.js
        └── services/
            ├── notifications.service.js  # createNotification(userId, type, message, link)
            └── achievements.service.js
```

---

## 5. BASE DE DATOS — MODELOS PRISMA

**User:** id, email (unique), username (unique), passwordHash, bio, avatarUrl, points, createdAt, updatedAt

**Route:** id, title, description, difficulty, distanceKm, elevationM, estimatedTime, latitudeStart, longitudeStart, trackPoints (Json?), status, createdAt, updatedAt, userId

**Comment:** id, content, createdAt, updatedAt, userId, routeId, parentId (String?) — auto-relación "CommentReplies" con replies Comment[]

**RoutePhoto:** id, url, order, createdAt, routeId

**RouteCompletion:** id, notes, realTime, createdAt, userId, routeId — unique [userId, routeId]

**Follow:** id, createdAt, followerId, followingId — unique [followerId, followingId]

**Achievement:** id, name (unique), description, iconUrl, points, criterio, createdAt

**UserAchievement:** id, gainedAt, userId, achievementId — unique [userId, achievementId]

**Notification:** id, type, message, link (String?), read, createdAt, userId

**Favorite:** id, createdAt, userId, routeId — unique [userId, routeId]

**RevokedToken:** id, token (unique), expiresAt, createdAt

**PasswordResetToken:** id, token (unique), expiresAt, used (default false), createdAt, userId

---

## 6. PALETA DE COLORES ARVENTRA

| Uso | Color |
|---|---|
| Fondo principal | `#160d28` |
| Superficie (cards) | `#241640` |
| Bordes | `#3d2a5c` |
| Acento naranja (primario) | `#f97316` |
| Acento amarillo (nav, títulos) | `#fbbf24` |
| Acento rosa (detalles) | `#ec4899` |
| Texto muted | `#a78bb5` |
| Texto muy muted | `#8b7aa3` |

Variables CSS en `src/index.css` con nombres `--tb-*` (por legado del rebrand).

---

## 7. PROBLEMAS CONOCIDOS / DEUDA TÉCNICA

1. **Resend sin dominio:** Emails solo llegan al email registrado en Resend. FIX: comprar `arventra.app` y verificar en Resend.
2. **normalizeEmail vs Resend:** El email normalizado (sin puntos) no coincide con el email registrado en Resend (con puntos). FIX: dominio propio resuelve esto.
3. **Rate limiter en memoria:** Se resetea con cada deploy/restart del backend en Railway. FIX futuro: Redis.
4. **RLS deshabilitado en Supabase:** No es crítico porque el acceso siempre va por Express, nunca directo. FIX futuro: habilitar RLS.
5. **trackPoints sin compresión:** Arrays grandes para rutas largas. FIX futuro: Douglas-Peucker.
6. **Elevación GPS imprecisa:** `pos.coords.altitude` es poco fiable en celulares. FIX futuro: API Open-Elevation.
7. **Open Graph no funciona en crawlers:** React SPA no renderiza meta tags para WhatsApp/redes. FIX: Next.js o Vercel Edge Functions.
8. **URLs de producción:** Aún dicen `trailblaze-fawn.vercel.app`. FIX: custom domain cuando se compre `arventra.app`.
9. **Nombre del repo:** Sigue siendo `trailblaze` en GitHub.

---

## 8. FUNCIONALIDADES PLANEADAS

**Alta prioridad (próximas sesiones):**
1. **"Primer Explorador"** — badge permanente para el primer usuario en completar una ruta. Se verifica en `completeRoute` si `_count.completions === 0`. Muy diferenciador frente a Strava/AllTrails.
2. **Retos mensuales globales** — tabla `monthly_challenges` con tipo, meta, fechas. Sin panel admin — gestión directa en Supabase. Tipos: distancia acumulada, rutas completadas, elevación total.
3. **Ranking mensual** — separado del global, basado en puntos del mes actual.

**Media prioridad:**
4. Mapas offline — cachear tiles con Service Worker
5. Retos de exploración — completar rutas nuevas nunca hechas
6. Verificación de email al registrarse (requiere dominio)

**Largo plazo:**
7. React Native + Expo — app nativa. Backend listo. Services y Zustand reutilizables.
8. Grupos y eventos de senderismo
9. Admin dashboard para gestión de retos

---

## 9. DIFERENCIACIÓN COMPETITIVA

| Feature | ARVENTRA | Strava | Wikiloc | AllTrails |
|---|---|---|---|---|
| Hispanohablante nativo | Sí | No | Parcial | No |
| "Primer Explorador" | Planeado | No | No | No |
| Retos de exploración | Planeado | No | No | No |
| Grabación GPS | Sí | Sí | Sí | Sí |
| PWA instalable | Sí | No | No | No |
| Gratis completo | Sí | Parcial | Parcial | Parcial |

---

## 10. CONVENCIONES Y PATRONES CRÍTICOS

### NUNCA hacer esto
- Copiar/pegar JSX directo en VS Code — los caracteres especiales se corrompen silenciosamente
- Usar `migrate dev` — Supabase lo bloquea. Siempre `npx prisma db push`
- Actualizar Prisma a v7 — tiene breaking changes en datasource
- Poner endpoints con parámetros dinámicos antes de estáticos (`/:id` siempre después de `/feed`, `/popular`, `/search`)

### SIEMPRE hacer esto
- Escribir archivos JSX con scripts PowerShell: `$code = @' ... '@ ; $code | node --input-type=module`
- Commits en Conventional Commits: `feat:`, `fix:`, `security:`, `chore:`
- Responder `N` a cualquier prompt S/N de Prisma
- Para edits pequeños: `readFileSync` + string replace + `writeFileSync`

### Comandos clave
```
# Backend
cd C:\proyectos\trailblaze\backend && npm run dev

# Frontend
cd C:\proyectos\trailblaze\frontend && npm run dev

# Puerto ocupado
npx kill-port 3000

# DB push
cd backend && npx prisma db push
cd backend && npx prisma generate
```

### Cuenta de prueba
- Username: `trailero01` / Email: `trailero@test.com` / Password: `miclave123`

### URLs de producción actuales
- Frontend: `https://trailblaze-fawn.vercel.app`
- Backend: `https://trailblaze-production-204a.up.railway.app`
- Repo: `https://github.com/Iker-in/trailblaze`

### Variables de entorno (Railway + .env local)
`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `FRONTEND_URL`, `NODE_ENV`

---

## 11. INSTRUCCIONES PARA FUTUROS CLAUDE

Eres el arquitecto senior y mentor técnico de **ARVENTRA** (anteriormente TrailBlaze). Continúas el desarrollo donde se dejó.

**Ya está decidido — no volver a discutir:**
- Stack tecnológico completo (ver sección 3)
- Nombre: ARVENTRA, logo: flecha brújula + círculo, paleta: morado-negro + naranja/amarillo/rosa
- Prisma v6 pinado, siempre `db push`
- Nunca copiar JSX directo al editor

**Cómo responder:**
- Edits específicos: archivo + línea o bloque exacto + explicación breve. No generar archivos completos salvo que sea estrictamente necesario.
- Cuando el desarrollador confirme ("ya", "listo"), dar el siguiente paso inmediato con una instrucción o pregunta concreta.
- Hacer security review OWASP para cada feature nueva.
- Flaggear malas decisiones técnicas aunque el desarrollador no las detecte.
- Priorizar momentum — construir, no refactorizar sin razón.
- Si Supabase cae: indicar que es temporal y esperar.

**Sobre el desarrollador:**
- Estudiante de programación, nivel intermedio en React/JS
- Necesita explicaciones de conceptos nuevos antes del código
- Prefiere ver resultados rápidos y entender después
- Usa Windows 10/11, PowerShell, VS Code

---

## 12. RESUMEN COMPACTO

ARVENTRA es una plataforma web comunitaria para senderistas hispanohablantes, completamente funcional en producción, rebrandeada desde TrailBlaze. Stack: React+Vite→Vercel / Node+Express→Railway / PostgreSQL+Prisma v6→Supabase / Cloudinary / Resend / Leaflet.

Funcionalidades implementadas: Auth JWT completo con refresh token blacklist, grabación GPS en tiempo real con mapa Leaflet live (pause/resume, cronómetro, distancia Haversine, elevación, precisión GPS, auto-seguimiento), trazado del recorrido en mapa de ruta, feed personalizado, comentarios con threads y paginación, favoritos, edición de rutas, sistema de niveles/badges (5 niveles), avatares en Cloudinary, búsqueda de usuarios con debounce en Navbar, filtro "Cerca de mí" GPS en listado, notificaciones con links, ranking global, logros/gamificación, PWA instalable en Android e iOS.

Próximo en el roadmap: Badge "Primer Explorador" (primer usuario en completar una ruta nueva), retos mensuales globales (distancia/rutas/elevación sin panel admin), ranking mensual separado, mapas offline, React Native con Expo.

Patrones críticos: nunca copiar JSX directo (usar scripts node con writeFileSync), Prisma v6 pinado con db push, endpoints estáticos SIEMPRE antes de dinámicos en las rutas, rate limiter en memoria se resetea con cada restart. Pendiente con dominio arventra.app: Resend para emails reales, custom domain en Vercel.
