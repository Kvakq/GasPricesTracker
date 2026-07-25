// backend/server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Store prices in server memory
let latestPrices = [];

// 1. GET endpoint for React (Serves current prices to the frontend)
app.get('/api/prices', (req, res) => {
  res.json(latestPrices);
});

// 2. POST endpoint for n8n (Receives and merges fresh prices)
app.post('/api/prices', (req, res) => {
  const newStations = req.body;
  
  if (!newStations || !Array.isArray(newStations)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
  }

  // Merge new data with existing data to prevent missing prices
  newStations.forEach(newStation => {
    // Check if we already have this station in our memory
    const existingStationIndex = latestPrices.findIndex(s => s.id === newStation.id);

    if (existingStationIndex !== -1) {
      // Station exists! Merge the old prices with the new ones
      const existingStation = latestPrices[existingStationIndex];
      
      latestPrices[existingStationIndex] = {
        ...existingStation, // Keep existing station info
        ...newStation,      // Update with any new basic info
        prices: {
          ...existingStation.prices, // Keep ALL previously known prices!
          ...newStation.prices       // Overwrite ONLY the prices that were just updated
        }
      };
    } else {
      // It's a completely new station, just add it to the list
      latestPrices.push(newStation);
    }
  });

  console.log(`[${new Date().toLocaleTimeString()}] Prices successfully merged from n8n! Total stations: ${latestPrices.length}`);
  
  res.json({ success: true, message: 'Prices updated and merged' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`- GET  /api/prices (For React)`);
  console.log(`- POST /api/prices (For n8n)`);
});