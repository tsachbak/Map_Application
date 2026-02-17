import { useEffect, useState, useCallback } from "react";
import { getMapData } from "../../api/mapDataApi";

/**
 * Fetches map data rows and exposes loading/error state with a `refresh` action.
 */
export default function useMapData() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMapData();
      setRows(data ?? []);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError("Failed to load map data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rows,
    loading,
    error,
    refresh: load,
  };
}
