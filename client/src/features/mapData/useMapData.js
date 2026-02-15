import { useEffect, useState, useCallback } from "react";
import { getMapData } from "../../api/MapDataApi";

/**
 * Custom hook to manage map data fetching and state.
 * It provides the fetched rows, loading and error states, and selection management for objects and polygons.
 */
export default function useMapData() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to load map data from the server
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
