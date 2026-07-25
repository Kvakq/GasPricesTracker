// src/components/StationCard.jsx
function StationCard({ station }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #eaeaea',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
    }}>
      {/* Top section: Station name, address, and company badge */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '1rem'
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#1a1a1a', fontSize: '1.2rem' }}>
            {station.name}
          </h3>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
            {station.address}
          </p>
        </div>
        <div style={{
          background: '#005bea',
          color: '#fff',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '0.8rem'
        }}>
          {station.company}
        </div>
      </div>

      {/* Bottom section: Fuel prices grid */}
      <div style={{ display: 'flex', gap: '3rem' }}>
        
        {/* Unleaded 95 */}
        <div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>
            95
          </div>
          <div style={{ 
            fontSize: '1.4rem', 
            fontWeight: '700', 
            color: station.prices['Bensiin 95'] ? '#333' : '#cccccc' 
          }}>
            {station.prices['Bensiin 95'] ? `${station.prices['Bensiin 95']} €` : 'N/A'}
          </div>
        </div>
        
        {/* Unleaded 98 */}
        <div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>
            98
          </div>
          <div style={{ 
            fontSize: '1.4rem', 
            fontWeight: '700', 
            color: station.prices['Bensiin 98'] ? '#333' : '#cccccc' 
          }}>
            {station.prices['Bensiin 98'] ? `${station.prices['Bensiin 98']} €` : 'N/A'}
          </div>
        </div>
        
        {/* Diesel */}
        <div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>
            Diesel
          </div>
          <div style={{ 
            fontSize: '1.4rem', 
            fontWeight: '700', 
            color: station.prices['Diisel'] ? '#333' : '#cccccc' 
          }}>
            {station.prices['Diisel'] ? `${station.prices['Diisel']} €` : 'N/A'}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StationCard;