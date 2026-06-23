const CACHE_NAME = 'arventra-v3'
const TILE_CACHE = 'arventra-tiles-v1'

const urlsToCache = [
  '/',
  '/logo.png',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== TILE_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Cachear tiles de OpenStreetMap
  if (url.hostname === 'tile.openstreetmap.org' || 
      url.hostname === 'a.tile.openstreetmap.org' ||
      url.hostname === 'b.tile.openstreetmap.org' ||
      url.hostname === 'c.tile.openstreetmap.org') {
    event.respondWith(
      caches.open(TILE_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached
          return fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone())
            return response
          }).catch(() => cached)
        })
      })
    )
    return
  }

  // Para el resto, red primero, cache como fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
