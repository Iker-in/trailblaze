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
