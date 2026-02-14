import { useState, useEffect } from "react";
import { getObjects, saveObjects, deleteObject } from "../../api/objectsApi";

/**
 * useObjects is a custom hook that manages the state and operations related to map objects.
 */
export default function useObjects() {
  const [savedObjects, setSavedObjects] = useState([]);
  const [draftObjects, setDraftObjects] = useState([]);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [selectedSavedObject, setSelectedSavedObject] = useState(null);

  /// Loads the saved objects from the backend and updates the state.
  async function loadObjects() {
    try {
      const data = await getObjects();

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

  // Saves the draft objects to the backend and refreshes the saved objects list.
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

  // Deletes the object with the specified ID and refreshes the saved objects list.
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

  // Adds a new draft object with the specified latitude and longitude.
  function addDraftObject(lat, lng) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setDraftObjects((prev) => [
      ...prev,
      {
        id,
        lat,
        lng,
        type: "marker",
      },
    ]);
  }

  // Selects a saved object by its ID and updates the selectedSavedObject state.
  function selectSavedObjectById(id) {
    const object = savedObjects.find((o) => o.id === id) ?? null;
    setSelectedSavedObject(object);
  }

  // Toggles the add object mode. If turning off, it also clears any draft objects.
  function toggleAddMode() {
    setIsAddingObject((prev) => {
      const next = !prev;

      if (!next) {
        setDraftObjects([]);
      }

      return next;
    });
  }

  // Stops the add object mode and clears any draft objects.
  function stopAddMode() {
    setIsAddingObject(false);
    setDraftObjects([]);
  }

  // Load saved objects on initial render.
  useEffect(() => {
    loadObjects();
  }, []);

  return {
    savedObjects,
    draftObjects,
    isAddingObject,
    selectedSavedObject,
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
  };
}
