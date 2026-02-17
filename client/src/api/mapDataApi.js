import { get, del, download } from "./httpClient";

export function getMapData() {
  return get("/mapdata");
}

export function clearAllMapData() {
  return del("/mapdata/clear-all");
}

export function exportMapDataGeoJson() {
  return download("/mapdata/export-geojson");
}
