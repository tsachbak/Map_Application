import { get, post, del } from "./httpClient";

/**
 * Fetches the saved polygons from the backend.
 */
export function getPolygons() {
  return get("/polygons");
}

/**
 * Saves a polygon to the backend.
 */
export function savePolygon(polygon) {
  const payload = {
    name: polygon.name ?? "polygon",
    points: (polygon.points ?? []).map((p) => ({
      latitude: p.lat,
      longitude: p.lng,
    })),
  };
  return post("/polygons/save", payload);
}
