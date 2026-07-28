import { useState, useEffect } from 'react';
import './App.css';
import StationCard from './components/StationCard';
import StationsMap from './components/StationsMap';

// ==========================================
// MATH MAGIC: Calculate distance between two GPS coordinates in kilometers
// ==========================================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

function App() {
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null); 
  const [highlightedId, setHighlightedId] = useState(null);

  // New State: Store user's actual GPS location
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/prices')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching prices:', error));
  }, []);

  // ==========================================
  // GEOLOCATION LOGIC
  // ==========================================
  const handleFindNearest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSortBy('nearest'); // Switch sorting mode to 'nearest'
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
      
      // If the search bar is empty, show all stations
      if (!term) return true; 

      const name = (station.name || '').toLowerCase();
      const address = (station.address || '').toLowerCase();
      
      // 1. Extract the city (it usually comes after the last comma in the address)
      // Example: "Tallinna mnt 55a, Narva" -> city = "narva"
      const parts = address.split(',');
      const city = parts.length > 1 ? parts[parts.length - 1].trim() : '';

      // 2. Exact match for the city (e.g., if the user types exactly "tallinn")
      if (city === term) return true;

      // 3. SMART FILTER for Tallinn specifically:
      // If the user typed "tallinn", but the actual city is NOT Tallinn (e.g., Narva),
      // it means the match was found in the street name "Tallinna mnt". We must ignore it!
      if (term === 'tallinn' && city !== 'tallinn') {
        // We only keep it if the station's actual name contains the word
        return name.includes(term); 
      }

      // 4. Default search (works for partial street names like "smuuli", "peterburi", etc.)
      return name.includes(term) || address.includes(term);
    })
    .sort((a, b) => {
      // 1. Sort by Distance (if Nearest is active and we have user coords)
      if (sortBy === 'nearest' && userLocation) {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      }
      
      // 2. Sort by Price
      if (sortBy === '95') {
        const priceA = a.prices['Bensiin 95'] || 999;
        const priceB = b.prices['Bensiin 95'] || 999;
        return priceA - priceB;
      }

      if (sortBy === '98') {
        const priceA = a.prices['Bensiin 98'] || 999;
        const priceB = b.prices['Bensiin 98'] || 999;
        return priceA - priceB;
      }

      if (sortBy === 'diesel') {
        const priceA = a.prices['Diisel'] || 999;
        const priceB = b.prices['Diisel'] || 999;
        return priceA - priceB;
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
    
    setTimeout(() => {
      setHighlightedId(null);
    }, 2500);
  };

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
                className={`chip ${sortBy === '98' ? 'active' : ''}`}
                onClick={() => setSortBy('98')}
                >
                  Cheapest 98
                  </button>

                <button 
                  className={`chip ${sortBy === 'diesel' ? 'active' : ''}`}
                  onClick={() => setSortBy('diesel')}
                >
                  Cheapest Diesel
                </button>
                
                <button 
                  className={`chip ${sortBy === 'nearest' ? 'active' : ''}`}
                  onClick={handleFindNearest}
                >
                  📍 Nearest
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px', color: 'var(--neste-gray)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Showing {displayStations.length} stations
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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