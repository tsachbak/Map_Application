import { post } from "./httpClient";

/**
 * Saves the provided draft objects to the backend.
 * @param {*} draftObjects
 * @returns
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
