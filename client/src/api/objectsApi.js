import { get, post, del } from "./httpClient";

/**
 * Saves the provided draft objects to the backend.
 */
export function saveObjects(draftObjects) {
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

/**
 * Fetches the saved objects from the backend.
 */
export function getObjects() {
  return get("/objects");
}

/**
 * Deletes the object with the specified ID from the backend.
 */
export function deleteObject(id) {
  return del(`/objects/${id}`);
}
