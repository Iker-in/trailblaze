export function pointToSegmentDistanceMeters(lat, lng, aLat, aLng, bLat, bLng) {
  const mPerDegLat = 111320
  const mPerDegLng = 111320 * Math.cos(lat * Math.PI / 180)

  const px = lng * mPerDegLng, py = lat * mPerDegLat
  const ax = aLng * mPerDegLng, ay = aLat * mPerDegLat
  const bx = bLng * mPerDegLng, by = bLat * mPerDegLat

  const dx = bx - ax, dy = by - ay
  const lenSq = dx * dx + dy * dy
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))

  const closestX = ax + t * dx, closestY = ay + t * dy
  return Math.hypot(px - closestX, py - closestY)
}

export function calculateRouteCoverage(recordedPoints, officialPoints, corridorMeters = 50) {
  if (!officialPoints || officialPoints.length === 0) return 100
  if (!recordedPoints || recordedPoints.length < 2) return 0

  let covered = 0
  for (const [oLat, oLng] of officialPoints) {
    let minDist = Infinity
    for (let i = 0; i < recordedPoints.length - 1; i++) {
      const [aLat, aLng] = recordedPoints[i]
      const [bLat, bLng] = recordedPoints[i + 1]
      const d = pointToSegmentDistanceMeters(oLat, oLng, aLat, aLng, bLat, bLng)
      if (d < minDist) minDist = d
      if (minDist <= corridorMeters) break
    }
    if (minDist <= corridorMeters) covered++
  }
  return (covered / officialPoints.length) * 100
}

export function calculateTrackDistance(points) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const [lat1, lon1] = points[i - 1]
    const [lat2, lon2] = points[i]
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }
  return Math.round(total * 100) / 100
}

export function calculateTrackElevationGain(points) {
  let gain = 0
  for (let i = 1; i < points.length; i++) {
    const alt1 = points[i - 1][2]
    const alt2 = points[i][2]
    if (alt1 != null && alt2 != null && alt2 > alt1) {
      gain += alt2 - alt1
    }
  }
  return Math.round(gain)
}
