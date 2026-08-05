# GasPricesTracker

GasPricesTracker is a responsive web application that shows live fuel prices for Neste gas stations across Estonia. It helps users quickly find the cheapest fuel (95, 98, or diesel), locate the nearest station, get directions (Waze / Google Maps), and view station-specific price details on a map and in per-station tables.

## 🎬 Demo

[▶️ Watch 2-minute project demo on YouTube](https://www.youtube.com/watch?v=1VNVmlx97bw)

Key goals:
- Make it simple to find the cheapest nearby fuel or a specific station.
- Visualize all stations on a map and provide precise directions and addresses.
- Keep prices up-to-date automatically via an n8n workflow.

## Features
- Displays all Neste gas stations in Estonia along with their latest prices.
- Quick-find buttons for the cheapest 95 and 98 gasoline, and the cheapest diesel.
- "Nearest" button to locate the closest station to your current location (browser geolocation).
- Per-station table that shows prices, full address, and two quick-direction buttons (Waze and Google Maps).
- Click a station marker on the map to jump to that station's table view and highlight it.
- Search bar to filter stations by city or address; the map and lists update accordingly.
- Fully responsive UI for use on phones, tablets, and desktops.
- Automated price updates via an n8n workflow that POSTs fresh data to the backend.

## Project structure (important files)
- [package.json](package.json) — frontend project manifest (Vite + React).
- [vite.config.js](vite.config.js) — Vite configuration.
- [index.html](index.html) — app entry HTML.
- [src/](src) — React app source code.
- [public/](public) — public assets.
- [backend/](backend) — small Express backend and local data storage.
- [backend/server.js](backend/server.js) — Express server exposing the API.
- [backend/database.json](backend/database.json) — persisted snapshot of the latest station data (written by the backend when updated).
- [backend/package.json](backend/package.json) — backend dependencies and start script.

## Technology stack
- Frontend: React 19 + Vite (fast dev server and build)
- Map: Leaflet + react-leaflet
- Backend: Node.js + Express
- Automation: n8n (external workflow that fetches price data and POSTs to backend)
- Development tooling: ESLint (configuration included)

(Exact package versions are available in [package.json](package.json) and [backend/package.json](backend/package.json).)

## How it works (data flow)
1. The frontend (React) requests station data from the backend API: GET /api/prices.
2. A scheduled n8n workflow (or any external process) fetches the latest prices from the source and POSTs an array of station objects to the backend endpoint POST /api/prices.
3. The backend overwrites [backend/database.json] with the fresh snapshot and serves that data to the frontend.
4. The frontend renders map markers, station lists, and per-station tables based on the JSON returned from GET /api/prices.

## Prerequisites
- Node.js (recommended v18+)
- npm (comes with Node.js)
- (Optional) n8n running or another scheduler to push price updates to the backend

## Local development — step by step
1. Clone the repository

   git clone <repo-url>
   cd GasPricesTracker

2. Install frontend dependencies (root)

   npm install

3. Install backend dependencies

   cd backend
   npm install
   cd ..

4. Start the backend server (serves data and accepts updates)

   # in one terminal
   cd backend
   npm start

   The backend defaults to port 3000 and exposes:
   - GET http://localhost:3000/api/prices — returns the current station list JSON
   - POST http://localhost:3000/api/prices — accepts a JSON array of station objects and overwrites database.json

5. Start the frontend dev server (Vite)

   # in another terminal, from project root
   npm run dev

   Vite typically serves the app at http://localhost:5173 — open that URL in the browser.

6. Open the app in your browser and interact with the map, search, and quick-find buttons.

## Example: Updating prices via curl (useful for testing n8n)
To simulate the n8n workflow or test the update endpoint, POST a JSON array of station objects to the backend. Example (replace payload.json with a real array):

   curl -X POST http://localhost:3000/api/prices \
     -H "Content-Type: application/json" \
     --data-binary @payload.json

*(If ngrok is running, you can also test this by sending the POST request directly to your public ngrok URL).*

Response: { success: true, message: 'Database fully overwritten with fresh data!' }

Notes about payload format:
- The backend expects a top-level JSON array where each item represents a station with the properties the frontend expects (id, name, address, coordinates, prices, etc.). Check existing [backend/database.json](backend/database.json) as an example snapshot.

## n8n integration
The project relies on an external n8n workflow to fetch and update prices automatically. Based on the setup, the workflow consists of 4 main steps:
1. **Trigger**: Executes the workflow (manually or on a schedule).
2. **HTTP Request (GET)**: Fetches raw fuel price data from the external source.
3. **Code (JavaScript)**: Filters the raw data strictly for Neste stations and formats it into the clean JSON array expected by the frontend.
4. **HTTP Request (POST)**: Sends the formatted payload directly to this backend.

## n8n integration
The project relies on an external n8n workflow to fetch and update prices automatically. Based on the setup, the workflow consists of 4 main steps:
1. **Trigger**: Executes the workflow (manually or on a schedule).
2. **HTTP Request (GET)**: Fetches raw fuel price data from the external source.
3. **Code (JavaScript)**: Filters the raw data strictly for Neste stations and formats it into the clean JSON array expected by the frontend.
4. **HTTP Request (POST)**: Sends the formatted payload directly to this backend.

**Connecting n8n to local backend using ngrok**
Since n8n needs a public URL to reach the local backend, we use **ngrok** with a static domain. This provides a permanent URL, so you don't need to change the n8n configuration every time you restart the server.

1. Start the local backend:
   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, expose port 3000 using your static ngrok domain:
```bash
ngrok http --domain=slept-unblended-service.ngrok-free.dev 3000
```

## Production build & deployment
1. Build the frontend:

   npm run build

   The built static files will be placed in the dist/ directory.

2. Serve the static files with a static server (e.g., Netlify, Vercel, nginx) and run the backend server (node backend/server.js) on a host accessible to n8n.

3. Ensure the backend's POST endpoint is reachable by n8n so it can update prices.

Optional: Serve built frontend from Express by adding a static middleware to the backend if you want a single server process.

## Troubleshooting
- CORS: The backend already enables CORS. If the frontend can't fetch data, ensure backend is running on the expected port and reachable from the browser.
- Ports: Backend uses port 3000. Vite dev server uses 5173 by default. Change them if these ports conflict with other services.
- Data format: If POST /api/prices returns 400, verify the payload is a JSON array (top-level) and not an object.
- Logs: Backend prints initialization and write logs to the console. Check backend terminal for write errors when n8n posts updates.

## Development notes
- Map rendering relies on Leaflet + react-leaflet — marker clustering or performance improvements can be added if needed for many markers.
- The backend intentionally performs a complete overwrite of the saved snapshot on each POST. If incremental merges are required later, adapt [backend/server.js](backend/server.js).

## Contributing
Contributions are welcome. Open issues or PRs with bug reports or improvements. Small steps:
- Fork the repo
- Create a feature branch
- Open a PR with a clear description
