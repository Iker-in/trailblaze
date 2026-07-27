
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { splitTrackIntoSegments } from '../utils/gpsFilter.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function RouteMap({ latitude, longitude, title, trackPoints }) {
  if (!latitude || !longitude) return null

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 mb-6" style={{ height: '300px' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
  attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`}
/>
        {trackPoints && splitTrackIntoSegments(trackPoints).map((segment, i) => (
          <Polyline key={i} positions={segment} color="#F2854D" weight={4} />
        ))}
        <Marker position={[latitude, longitude]}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default RouteMap