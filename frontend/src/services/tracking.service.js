import api from './api.js'

export const startTracking = (lat, lng) => api.post('/tracking/start', { lastLat: lat, lastLng: lng })
export const updateTracking = (lat, lng) => api.patch('/tracking/update', { lastLat: lat, lastLng: lng })
export const stopTracking = () => api.delete('/tracking/stop')
