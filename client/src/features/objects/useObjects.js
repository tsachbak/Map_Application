import { useState, useEffect } from "react";
import { getObjects, saveObjects, deleteObject } from "../../api/objectsApi";
import { SYMBOL_TYPES } from "./symbolLibrary";

/**
 * Manages saved map objects, draft objects, and related CRUD actions.
 */
export default function useObjects() {
  const [savedObjects, setSavedObjects] = useState([]);
  const [draftObjects, setDraftObjects] = useState([]);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [selectedSavedObject, setSelectedSavedObject] = useState(null);
  const [selectedObjectType, setSelectedObjectType] = useState(
    SYMBOL_TYPES.MARKER,
  );

  async function loadObjects() {
    try {
      const data = await getObjects();

      // Normalize backend DTOs into the shape expected by map/UI components.
      const mapped = (data ?? [])
        .map((o) => {
          if (!o?.id) return null;

          return {
            id: o.id,
            object: o.object ?? "",
            lat: o.latitude,
            lng: o.longitude,
            type: o.type ?? "marker",
          };
        })
        .filter(Boolean);

      setSavedObjects(mapped);
    } catch (error) {
      console.error("[useObjects] failed to load objects:", error);
    }
  }

  async function saveDraftObjectsAsync() {
    if (draftObjects.length === 0) return;

    try {
      const response = await saveObjects(draftObjects);
      console.log("[useObjects] server response:", response);

      await loadObjects();

      setDraftObjects([]);
      setIsAddingObject(false);
    } catch (error) {
      console.error("[useObjects] failed to save objects:", error);
      alert(error.message);
    }
  }

  async function deleteObjectByIdAsync(id) {
    if (!id) return;

    try {
      await deleteObject(id);
      await loadObjects();
      setSelectedSavedObject(null);
    } catch (error) {
      console.error(
        `[useObjects] failed to delete object with id ${id}:`,
        error,
      );
      alert(error.message);
    }
  }

  function addDraftObject(lat, lng) {
    // Local temporary ID is enough until objects are persisted and receive server IDs.
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setDraftObjects((prev) => [
      ...prev,
      {
        id,
        lat,
        lng,
        type: selectedObjectType ?? SYMBOL_TYPES.MARKER,
      },
    ]);
  }

  function selectSavedObjectById(id) {
    const object = savedObjects.find((o) => o.id === id) ?? null;
    setSelectedSavedObject(object);
  }

  function toggleAddMode() {
    setIsAddingObject((prev) => {
      const next = !prev;

      if (!next) {
        // Leaving add mode discards unfinished drafts to avoid stale map markers.
        setDraftObjects([]);
      }

      return next;
    });
  }

  function stopAddMode() {
    setIsAddingObject(false);
    setDraftObjects([]);
  }

  useEffect(() => {
    loadObjects();
  }, []);

  return {
    savedObjects,
    draftObjects,
    isAddingObject,
    selectedSavedObject,
    selectedObjectType,
    loadObjects,
    saveDraftObjectsAsync,
    setDraftObjects,
    setIsAddingObject,
    setSelectedSavedObject,
    addDraftObject,
    deleteObjectByIdAsync,
    selectSavedObjectById,
    toggleAddMode,
    stopAddMode,
    setSelectedObjectType,
  };
}
