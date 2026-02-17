import { get, post, del } from "./httpClient";

export function getPolygons() {
  return get("/polygons");
}

export function savePolygon(polygon) {
  // Convert leaflet-style points to the DTO expected by the API.
  const payload = {
    name: polygon.name ?? "polygon",
    points: (polygon.points ?? []).map((p) => ({
      latitude: p.lat,
      longitude: p.lng,
    })),
  };
  return post("/polygons/save", payload);
}

export function deletePolygon(id) {
  return del(`/polygons/${id}`);
}
