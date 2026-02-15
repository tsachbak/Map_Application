import { useEffect, useState } from "react";
import { getPolygons, savePolygon, deletePolygon } from "../../api/polygonApi";

/**
 * usePolygons is a custom hook that manages the state and operations related to polygons on the map.
 */
export default function usePolygons() {
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [draftPolygonPoints, setDraftPolygonPoints] = useState([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedSavedPolygon, setSelectedSavedPolygon] = useState(null);

  // Toggles the draw mode for polygons.
  function toggleDrawMode() {
    if (isDrawingPolygon) {
      stopDrawMode();
      return;
    }
    startDrawMode();
  }

  // Add a new point to the current draft polygon.
  function addPoint(lat, lng) {
    setDraftPolygonPoints((prev) => [...prev, { lat, lng }]);
  }

  // Closes the current polygon by marking it as closed and exiting draw mode.
  function closePolygon() {
    setIsPolygonClosed(true);
    setIsDrawingPolygon(false);
  }

  // Resets the draft polygon state, clearing all points and exiting draw mode.
  function resetDraft() {
    setIsDrawingPolygon(false);
    setIsPolygonClosed(false);
    setDraftPolygonPoints([]);
  }

  // Starts the draw mode for creating a new polygon.
  function startDrawMode() {
    setIsPolygonClosed(false);
    setDraftPolygonPoints([]);
    setIsDrawingPolygon(true);
  }

  // Stops the draw mode and resets the draft polygon state.
  function stopDrawMode() {
    setIsDrawingPolygon(false);
    setDraftPolygonPoints([]);
    setIsPolygonClosed(false);
  }

  // Saves the closed polygon to the backend and resets the draft state.
  async function saveClosedPolygonAsync() {
    if (!isPolygonClosed || draftPolygonPoints.length < 3) return;

    try {
      const polygon = {
        name: "polygon",
        points: draftPolygonPoints,
      };

      const response = await savePolygon(polygon);
      console.log("[usePolygons] server response:", response);

      await loadPolygons();
      resetDraft();
    } catch (error) {
      console.error("[usePolygons] failed to save polygon:", error);
      alert(error.message);
    }
  }

  async function deleteSelectedPolygonAsync() {
    const id = selectedSavedPolygon?.id;

    if (!id) return;

    try {
      await deletePolygon(id);
      await loadPolygons();
      setSelectedSavedPolygon(null);
    } catch (error) {
      console.error(
        `[usePolygons] failed to delete polygon with id ${id}:`,
        error,
      );
      alert(error.message);
    }
  }

  // Loads the saved polygons from the backend and updates the state.
  async function loadPolygons() {
    try {
      const data = await getPolygons();

      const mapped = (data ?? [])
        .map((p) => {
          const ring = p?.location?.coordinates?.[0];

          if (!Array.isArray(ring) || ring.length < 4) return null;

          const points = ring.map((coord) => ({
            lat: coord[1],
            lng: coord[0],
          }));

          return {
            id: p.id,
            name: p.name ?? "polygon",
            points,
          };
        })
        .filter(Boolean);

      setSavedPolygons(mapped);
    } catch (error) {
      console.error("[usePolygons] failed to load polygons:", error);
    }
  }

  // Selects a saved polygon by its ID and updates the selected state.
  function selectSavedPolygonById(id) {
    const polygon = savedPolygons.find((p) => p.id === id) ?? null;
    setSelectedSavedPolygon(polygon);
  }

  useEffect(() => {
    loadPolygons();
  }, []);

  return {
    isDrawingPolygon,
    draftPolygonPoints,
    isPolygonClosed,
    savedPolygons,
    selectedSavedPolygon,
    toggleDrawMode,
    addPoint,
    closePolygon,
    resetDraft,
    startDrawMode,
    stopDrawMode,
    saveClosedPolygonAsync,
    loadPolygons,
    selectSavedPolygonById,
    deleteSelectedPolygonAsync,
    setSelectedSavedPolygon,
  };
}
