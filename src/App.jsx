import { useState, useEffect } from 'react';
import './App.css';
import StationCard from './components/StationCard';
import StationsMap from './components/StationsMap';

function App() {
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); 
  
  // New states for our Control Panel
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null); // can be: null, '95', or 'diesel'

  useEffect(() => {
    fetch('http://localhost:3000/api/prices')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching prices:', error));
  }, []);

  // ==========================================
  // CORE LOGIC: Filter and Sort stations dynamically
  // ==========================================
  const displayStations = stations
    .filter(station => {
      // 1. Search Filter: Check if name or address includes the search text
      const term = searchTerm.toLowerCase();
      const nameMatch = (station.name || '').toLowerCase().includes(term);
      const addressMatch = (station.address || '').toLowerCase().includes(term);
      return nameMatch || addressMatch;
    })
    .sort((a, b) => {
      // 2. Sort Logic: Push items without prices to the bottom (using 999 as a fake high price)
      if (sortBy === '95') {
        const priceA = a.prices['Bensiin 95'] || 999;
        const priceB = b.prices['Bensiin 95'] || 999;
        return priceA - priceB;
      }
      if (sortBy === 'diesel') {
        const priceA = a.prices['Diisel'] || 999;
        const priceB = b.prices['Diisel'] || 999;
        return priceA - priceB;
      }
      return 0; // Default: No sorting
    });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Neste Gas Prices ⛽️</h1>
      </header>

      <div className="mobile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📄 List
        </button>
        <button 
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Map
        </button>
      </div>

      {stations.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--neste-gray)' }}>Loading fresh data...</p>
      ) : (
        <div className="content-layout">
          
          <div className={`list-panel ${activeTab !== 'list' ? 'hidden' : ''}`}>
            
            {/* ==========================================
                CONTROL PANEL (Search & Chips)
                ========================================== */}
            <div className="control-panel">
              <input
                type="text"
                placeholder="Search by city (e.g. Tartu) or street..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <div className="sort-chips">
                <button 
                  className={`chip ${sortBy === null ? 'active' : ''}`}
                  onClick={() => setSortBy(null)}
                >
                  All
                </button>
                <button 
                  className={`chip ${sortBy === '95' ? 'active' : ''}`}
                  onClick={() => setSortBy('95')}
                >
                  Cheapest 95
                </button>
                <button 
                  className={`chip ${sortBy === 'diesel' ? 'active' : ''}`}
                  onClick={() => setSortBy('diesel')}
                >
                  Cheapest Diesel
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px', color: 'var(--neste-gray)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Showing {displayStations.length} stations
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Notice we map over displayStations now, not the raw stations array */}
              {displayStations.map(station => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </div>

          <div className={`map-panel ${activeTab !== 'map' ? 'hidden' : ''}`}>
            {/* The map also receives the filtered stations, so markers disappear when you search! */}
            <StationsMap stations={displayStations} />
          </div>

        </div>
      )}
    </div>
  );
}

export default App;