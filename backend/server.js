import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreating __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.json');
let latestPrices = [];

// Load existing data on startup
if (fs.existsSync(dbPath)) {
  const rawData = fs.readFileSync(dbPath, 'utf8');
  latestPrices = JSON.parse(rawData);
  console.log(`[INIT] Loaded ${latestPrices.length} stations from database.json`);
} else {
  console.log(`[INIT] No database.json found. Starting empty.`);
}

// 1. GET endpoint for React
app.get('/api/prices', (req, res) => {
  res.json(latestPrices);
});

// 2. POST endpoint for n8n (Now fully overwrites data!)
app.post('/api/prices', (req, res) => {
  const newStations = req.body;
  
  if (!newStations || !Array.isArray(newStations)) {
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  // COMPLETE OVERWRITE: We drop the old data and keep only the fresh 100% snapshot
  latestPrices = newStations;

  // Save the fresh snapshot to the file
  fs.writeFile(dbPath, JSON.stringify(latestPrices, null, 2), (err) => {
    if (err) {
      console.error('Error saving to database.json:', err);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] Overwrote database with ${latestPrices.length} fresh stations!`);
    }
  });
  
  res.json({ success: true, message: 'Database fully overwritten with fresh data!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});