import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Added 'onMarkerClick' to the component props
function StationsMap({ stations, onMarkerClick }) {
  const estoniaCenter = [58.5953, 25.0136];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={estoniaCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        zoomSnap={0.5} 
        wheelPxPerZoomLevel={100}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((station) => {
          if (!station.lat || !station.lng) return null;

          return (
            <Marker 
              key={station.id} 
              position={[station.lat, station.lng]}
              // Fire the onMarkerClick function when a user clicks the blue pin
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(station.id);
                }
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'sans-serif' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1a1a1a' }}>
                    {station.name}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '0.85rem' }}>
                    {station.address}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem' }}>
                    {station.prices['Bensiin 95'] && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <span style={{ color: '#666' }}>95:</span> 
                        <strong>{station.prices['Bensiin 95']} €</strong>
                      </div>
                    )}
                    {station.prices['Bensiin 98'] && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <span style={{ color: '#666' }}>98:</span> 
                        <strong>{station.prices['Bensiin 98']} €</strong>
                      </div>
                    )}
                    {station.prices['Diisel'] && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <span style={{ color: '#666' }}>Diesel:</span> 
                        <strong>{station.prices['Diisel']} €</strong>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default StationsMap;