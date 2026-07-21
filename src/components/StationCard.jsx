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
      {/* Верхняя часть: Название, адрес и бейдж компании */}
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
          background: '#005bea', // Синий цвет, похожий на бренд Neste
          color: '#fff',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '0.8rem'
        }}>
          {station.company}
        </div>
      </div>

      {/* Нижняя часть: Цены */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {station.prices['Bensiin 95'] && (
          <div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>95</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#333' }}>
              {station.prices['Bensiin 95']} €
            </div>
          </div>
        )}
        
        {station.prices['Bensiin 98'] && (
          <div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>98</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#333' }}>
              {station.prices['Bensiin 98']} €
            </div>
          </div>
        )}
        
        {station.prices['Diisel'] && (
          <div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>Diisel</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#333' }}>
              {station.prices['Diisel']} €
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StationCard;