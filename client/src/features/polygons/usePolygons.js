import { useEffect, useState } from "react";
import { getPolygons, savePolygon, deletePolygon } from "../../api/polygonApi";

/**
 * Manages drawing, persisting, selecting, and deleting map polygons.
 */
export default function usePolygons() {
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [draftPolygonPoints, setDraftPolygonPoints] = useState([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedSavedPolygon, setSelectedSavedPolygon] = useState(null);

  function toggleDrawMode() {
    if (isDrawingPolygon) {
      stopDrawMode();
      return;
    }
    startDrawMode();
  }

  function addPoint(lat, lng) {
    setDraftPolygonPoints((prev) => [...prev, { lat, lng }]);
  }

  function closePolygon() {
    setIsPolygonClosed(true);
    setIsDrawingPolygon(false);
  }

  function resetDraft() {
    setIsDrawingPolygon(false);
    setIsPolygonClosed(false);
    setDraftPolygonPoints([]);
  }

  function startDrawMode() {
    setIsPolygonClosed(false);
    setDraftPolygonPoints([]);
    setIsDrawingPolygon(true);
  }

  function stopDrawMode() {
    setIsDrawingPolygon(false);
    setDraftPolygonPoints([]);
    setIsPolygonClosed(false);
  }

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

  async function loadPolygons() {
    try {
      const data = await getPolygons();

      const mapped = (data ?? [])
        .map((p) => {
          // Backend stores GeoJSON polygon coordinates as [lng, lat] rings.
          const ring = p?.location?.coordinates?.[0];

          // Ignore invalid polygons; a closed ring needs at least 4 coordinates.
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
