import { clearAllMapData, exportMapDataGeoJson } from "../../api/mapDataApi";
import { saveBlobAs } from "../../utils/fileSave";

/**
 * useGlobalMapActions orchestrates global actions related to map data.
 */
export default function useGlobalMapActions({ objects, polygons, mapData }) {
  /// Export map data as GeoJSON file
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

  /// Clear all map data with confirmation
  async function clearAllDataAsync() {
    const confirmed = window.confirm(
      "Are you sure you want to clear all map data? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await clearAllMapData();

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
