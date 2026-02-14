import { useState } from "react";

/**
 * usePolygons is a custom hook that manages the state and operations related to polygons on the map.
 */
export default function usePolygons() {
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [draftPolygonPoints, setDraftPolygonPoints] = useState([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);

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

  return {
    isDrawingPolygon,
    draftPolygonPoints,
    isPolygonClosed,
    toggleDrawMode,
    addPoint,
    closePolygon,
    resetDraft,
    startDrawMode,
    stopDrawMode,
  };
}
