import { get, post, del } from "./httpClient";

export function saveObjects(draftObjects) {
  // Map UI draft shape to server DTO contract.
  const payload = {
    objects: (draftObjects ?? []).map((o) => ({
      object: o.id,
      latitude: o.lat,
      longitude: o.lng,
      type: o.type ?? "marker",
    })),
  };

  return post("/objects/save", payload);
}

export function getObjects() {
  return get("/objects");
}

export function deleteObject(id) {
  return del(`/objects/${id}`);
}
