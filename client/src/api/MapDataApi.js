import { get } from "./httpClient";

/**
 * Fetches map data from the server.
 */
export function getMapData() {
  return get("/mapdata");
}
