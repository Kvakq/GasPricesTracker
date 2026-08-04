import { useState, useEffect } from 'react';
import './App.css';
import StationCard from './components/StationCard';
import StationsMap from './components/StationsMap';
import ControlPanel from './components/ControlPanel';
import { calculateDistance } from './utils/geo';      

function App() {
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null); 
  const [highlightedId, setHighlightedId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/prices')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching prices:', error));
  }, []);

  const handleFindNearest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSortBy('nearest'); 
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please allow location access in your browser to find the nearest station.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  const displayStations = stations
    .filter(station => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true; 

      const name = (station.name || '').toLowerCase();
      const address = (station.address || '').toLowerCase();
      
      const parts = address.split(',');
      const city = parts.length > 1 ? parts[parts.length - 1].trim() : '';

      if (city === term) return true;

      if (term === 'tallinn' && city !== 'tallinn') {
        return name.includes(term); 
      }

      return name.includes(term) || address.includes(term);
    })
    .sort((a, b) => {
      if (sortBy === 'nearest' && userLocation) {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      }
      if (sortBy === '95') {
        return (a.prices['Bensiin 95'] || 999) - (b.prices['Bensiin 95'] || 999);
      }
      if (sortBy === '98') {
        return (a.prices['Bensiin 98'] || 999) - (b.prices['Bensiin 98'] || 999);
      }
      if (sortBy === 'diesel') {
        return (a.prices['Diisel'] || 999) - (b.prices['Diisel'] || 999);
      }
      return 0; 
    });

  const handleMarkerClick = (stationId) => {
    if (window.innerWidth <= 950) {
      setActiveTab('list');
    }

    setTimeout(() => {
      const cardElement = document.getElementById(`station-${stationId}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setHighlightedId(stationId);
    setTimeout(() => setHighlightedId(null), 2500);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Neste Gas Prices</h1>
      </header>

      <div className="mobile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <img src="/icon-list-24.png" alt="List" style={{ width: 20, height: 20, marginRight: 8 }} />
          List
        </button>
        <button 
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <img src="/icon-map-48.png" alt="Map" style={{ width: 20, height: 20, marginRight: 8 }} />
          Map
        </button>
      </div>

      {stations.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--neste-gray)' }}>Loading fresh data...</p>
      ) : (
        <div className="content-layout">
          
          <div className={`list-panel ${activeTab !== 'list' ? 'hidden' : ''}`}>
            
            {/* HERE IS OUR NEW CLEAN COMPONENT! */}
            <ControlPanel 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onFindNearest={handleFindNearest}
            />
            
            <div style={{ marginBottom: '15px', color: 'var(--neste-gray)', fontSize: 'var(--station-address-size)', fontWeight: 'bold' }}>
              Showing {displayStations.length} stations
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
              {displayStations.map(station => (
                <StationCard 
                  key={station.id} 
                  station={station} 
                  id={`station-${station.id}`}
                  isHighlighted={highlightedId === station.id}
                />
              ))}
            </div>
          </div>

          <div className={`map-panel ${activeTab !== 'map' ? 'hidden' : ''}`}>
            <StationsMap stations={displayStations} onMarkerClick={handleMarkerClick} />
          </div>

        </div>
      )}
    </div>
  );
}

export default App;