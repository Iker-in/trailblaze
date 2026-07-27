const MAX_ACCURACY_METERS = 30
const MAX_SPEED_MPS = 15
const GAP_SECONDS = 15

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function filterGpsPoint(pos, lastAccepted) {
  const { latitude, longitude, altitude, accuracy } = pos.coords
  const now = Date.now()

  if (accuracy != null && accuracy > MAX_ACCURACY_METERS) {
    return { accept: false, lastAccepted }
  }

  if (lastAccepted) {
    const distMeters = haversineMeters(lastAccepted.lat, lastAccepted.lng, latitude, longitude)
    const timeDeltaSec = (now - lastAccepted.timestamp) / 1000
    const impliedSpeed = timeDeltaSec > 0 ? distMeters / timeDeltaSec : 0

    if (impliedSpeed > MAX_SPEED_MPS) {
      return { accept: false, lastAccepted }
    }

    const gap = timeDeltaSec > GAP_SECONDS
    return {
      accept: true,
      point: [latitude, longitude, altitude],
      gap,
      lastAccepted: { lat: latitude, lng: longitude, timestamp: now }
    }
  }

  return {
    accept: true,
    point: [latitude, longitude, altitude],
    gap: false,
    lastAccepted: { lat: latitude, lng: longitude, timestamp: now }
  }
}

export function splitTrackIntoSegments(points) {
  if (!points) return []
  const segments = []
  let current = []
  for (const p of points) {
    if (p === null || p === undefined) {
      if (current.length > 1) segments.push(current)
      current = []
    } else {
      current.push(p)
    }
  }
  if (current.length > 1) segments.push(current)
  return segments
}
