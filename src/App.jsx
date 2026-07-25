import { useState, useEffect } from 'react';
import './App.css';
import StationCard from './components/StationCard';
import StationsMap from './components/StationsMap';

function App() {
  // State to store the list of stations (empty array by default)
  const [stations, setStations] = useState([]);

  // useEffect runs once when the component mounts to fetch fresh prices
  useEffect(() => {
    fetch('http://localhost:3000/api/prices')
      .then(response => response.json())
      .then(data => {
        setStations(data);
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
      });
  }, []);

return (
    <div className="app-container">
      <header className="header">
        <h1>Neste Gas Prices ⛽️</h1>
      </header>

      <main className="main-content">
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>
          Map & Prices
        </h2>
        
        {/* Show loading text if data is not yet available, otherwise render cards */}
        {stations.length === 0 ? (
          <p>Loading fresh data...</p>
        ) : (
          <>
            {/* Render the interactive map and pass the stations data to it */}
            <StationsMap stations={stations} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stations.map(station => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;