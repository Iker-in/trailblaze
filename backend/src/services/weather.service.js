const cache = new Map()
const CACHE_TTL_MS = 15 * 60 * 1000

export async function getRouteWeather(lat, lng) {
  const cacheKey = lat.toFixed(3) + "," + lng.toFixed(3)
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lng + '&appid=' + apiKey + '&units=metric&lang=es'

  const response = await fetch(url)
  if (!response.ok) throw new Error("Error al obtener el clima")
  const json = await response.json()

  const current = json.list[0]
  const tomorrowTarget = new Date()
  tomorrowTarget.setDate(tomorrowTarget.getDate() + 1)
  const tomorrowForecast = json.list.find((item) => {
    const itemDate = new Date(item.dt * 1000)
    return itemDate.getDate() === tomorrowTarget.getDate() && itemDate.getHours() >= 11 && itemDate.getHours() <= 14
  }) || json.list[8]

  const data = {
    current: {
      temp: Math.round(current.main.temp),
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      rainProbability: Math.round((current.pop || 0) * 100),
      updatedAt: new Date().toISOString()
    },
    tomorrow: {
      temp: Math.round(tomorrowForecast.main.temp),
      description: tomorrowForecast.weather[0].description,
      icon: tomorrowForecast.weather[0].icon,
      rainProbability: Math.round((tomorrowForecast.pop || 0) * 100)
    }
  }

  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}
