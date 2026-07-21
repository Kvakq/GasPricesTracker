// src/App.jsx
import './App.css';
import StationCard from './components/StationCard'; // Импортируем нашу новую карточку
import { getFormattedStations } from './utils/formatPrices';
import rawPricesData from './api/prices.json';

function App() {
  const stations = getFormattedStations(rawPricesData);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Neste Gas Prices ⛽️</h1>
      </header>

      <main className="main-content">
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>
          Real-Time Fuel Prices
        </h2>
        
        {/* Рендерим список карточек */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {stations.map(station => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>

      </main>
    </div>
  );
}

export default App;