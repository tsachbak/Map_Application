import { clearAllMapData, exportMapDataGeoJson } from "../../api/mapDataApi";
import { saveBlobAs } from "../../utils/fileSave";

/**
 * Coordinates global export/clear actions across objects, polygons, and map-data state.
 */
export default function useGlobalMapActions({ objects, polygons, mapData }) {
  async function exportGeoJsonAsync() {
    try {
      const { blob, fileName } = await exportMapDataGeoJson();

      await saveBlobAs(
        blob,
        fileName || "map_data.geojson",
        "application/geo+json",
      );
    } catch (error) {
      console.error("[useGlobalMapActions] Error exporting GeoJSON:", error);
      alert(error.message);
    }
  }

  async function clearAllDataAsync() {
    const confirmed = window.confirm(
      "Are you sure you want to clear all map data? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await clearAllMapData();

      // Reset local UI state first to avoid showing stale selections during refresh.
      objects.setSelectedSavedObject(null);
      objects.setDraftObjects([]);
      objects.setIsAddingObject(false);

      polygons.setSelectedSavedPolygon(null);
      polygons.resetDraft();

      await objects.loadObjects();
      await polygons.loadPolygons();
      await mapData.refresh();
    } catch (error) {
      console.error("[useGlobalMapActions] Error clearing map data:", error);
      alert(error.message);
    }
  }

  return {
    exportGeoJsonAsync,
    clearAllDataAsync,
  };
}
