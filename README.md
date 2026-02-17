# Map_Application

Job Interview Task – Map Application.

## What this app does

This application lets you:

- Add and save map objects (marker/jeep/ship/airplane).
- Draw, close, save, and delete polygons.
- View map data rows and select objects/polygons from the table.
- Export all map data to GeoJSON.
- Clear all map data from the database.

## Prerequisites

### For Docker run (recommended for testers)

- Docker Desktop (running)

### For local development run

- Node.js 20+
- npm
- .NET SDK 8.0+
- MongoDB (local service on port 27017)

## Quick Start (one command with Docker)

From the repository root:

```bash
docker compose up --build
```

Open:

- Client: http://localhost:3000
- Server Swagger: http://localhost:5033/swagger

Stop containers:

```bash
docker compose down
```

## Build and Run (local, without Docker)

### 1) Start MongoDB

Ensure MongoDB is running on:

`mongodb://localhost:27017`

### 2) Run server (.NET)

```bash
cd server/server
dotnet restore
dotnet build
dotnet run --launch-profile http
```

Server URL: http://localhost:5033

### 3) Run client (CRA)

In a new terminal:

```bash
cd client
npm install
npm run build
npm start
```

Client URL: http://localhost:3000

## How to use the application

### Objects flow

1. In the **Objects** panel, click **Add**.
2. Choose object type (marker/jeep/ship/airplane).
3. Click on the map to add draft objects.
4. Click **Save** to persist them.
5. Click an existing object on map (or map-data table row) to select it.
6. Click **Delete** to remove selected object.

Notes:

- Clicking **Stop** in add mode discards unsaved draft objects.
- Selected objects are highlighted on the map.

### Polygons flow

1. In the **Polygons** panel, click **Add**.
2. Click on the map to place polygon points.
3. To close polygon: click the first point (enabled after at least 3 points).
4. Click **Save** to persist closed polygon.
5. Click existing polygon on map (or polygon-vertex row in table) to select it.
6. Click **Delete** to remove selected polygon.

Notes:

- **Save** is enabled only for a closed draft polygon.
- Leaving polygon draw mode clears the current draft.

### Map Data panel

- Shows consolidated rows for saved objects and polygon vertices.
- Clicking a row selects and focuses the related object/polygon on the map.

### Global actions

- **Export** downloads all map data as GeoJSON.
- **Clear** removes all map data after confirmation.
- **Import** is currently disabled in UI.

## Tech stack

- Frontend: React (Create React App), Leaflet, React-Leaflet
- Backend: ASP.NET Core Web API (.NET 8)
- Database: MongoDB
- Orchestration: Docker Compose
