import { get, del } from "./httpClient";

/**
 * Fetches map data from the server.
 */
export function getMapData() {
  return get("/mapdata");
}

export function clearAllMapData() {
  return del("/mapdata/clear-all");
}
