import { get, del, download } from "./httpClient";

/**
 * Fetches map data from the server.
 */
export function getMapData() {
  return get("/mapdata");
}

/**
 * Clears all map data (objects and polygons) from the server.
 */
export function clearAllMapData() {
  return del("/mapdata/clear-all");
}

export function exportMapDataGeoJson() {
  return download("/mapdata/export-geojson");
}
