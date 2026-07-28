// We now accept id and isHighlighted as props
function StationCard({ station, id, isHighlighted }) {
  return (
    <div 
      id={id} // We attach the ID here so the smart scroll can find it
      style={{
        background: '#ffffff',
        border: '1px solid #eaeaea',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        // 1. Add smooth transition for the glow effect
        transition: 'all 0.4s ease', 
        // 2. Dynamic box-shadow: green glow if highlighted, standard shadow if not
        boxShadow: isHighlighted 
          ? 'inset 0 0 0 2px #62bb21, 0 0 20px rgba(98, 187, 33, 0.3)' 
          : '0 4px 12px rgba(0,0,0,0.03)'
      }}
    >
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

      {/* Middle section: Fuel prices grid */}
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

      {/* Bottom section: Navigation buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginTop: '0.5rem',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '1rem'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click events
            window.open(`https://waze.com/ul?ll=${station.lat},${station.lng}&navigate=yes`, '_blank', 'noopener,noreferrer');
          }}
          style={{
            flex: 1,
            padding: '0.7rem',
            backgroundColor: '#33ccff', // Waze brand-like color
            color: '#fff',
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          Waze
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click events
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank', 'noopener,noreferrer');
          }}
          style={{
            flex: 1,
            padding: '0.7rem',
            backgroundColor: '#34a853', // Google Maps brand-like color
            color: '#fff',
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          Google Maps
        </button>
      </div>

    </div>
  );
}

export default StationCard;