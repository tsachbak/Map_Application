/**
 * Saves a blob using the native Save As dialog when available.
 * Falls back to a regular download when the File System Access API is unavailable.
 */
export async function saveBlobAs(blob, suggestedFileName, mimeType) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: suggestedFileName,
        types: [
          {
            description: "GeoJSON",
            accept: {
              [mimeType ?? "application/geo+json"]: [".geojson", ".json"],
            },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        console.warn("File save cancelled by user");
        return;
      }
      throw error;
    }
  }

  // Fallback for browsers that do not support the File System Access API
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedFileName || "map_data.geojson";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
