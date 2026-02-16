/**
 * Display label utilities for map objects and polygons shown in the MapDataTable.
 */

/// Builds a Map of ID to display label for the given items and prefix.
export function buildLabelMap(items = [], prefix) {
  const map = new Map();
  if (!Array.isArray(items)) return map;

  items.forEach((item, index) => {
    if (!item?.id) return;
    map.set(item.id, `${prefix} #${index + 1}`);
  });

  return map;
}

/// Gets the display label for an object by its ID using the provided label map.
export function getObjectDisplayLabelById(id, objectLabelsById) {
  return objectLabelsById.get(id) ?? "Object";
}

/// Gets the display label for a polygon by its ID using the provided label map.
export function getPolygonDisplayLabelById(id, polygonLabelsById) {
  return polygonLabelsById.get(id) ?? "Polygon";
}

/// Gets the display label for a map data row based on its type and associated label maps.
export function getRowDisplayLabel(row, objectLabelsById, polygonLabelsById) {
  if (!row) return "";

  if (row.rowType === "Object") {
    return getObjectDisplayLabelById(row.sourceId, objectLabelsById);
  }

  if (row.rowType === "PolygonVertex") {
    const polygonLabel = getPolygonDisplayLabelById(
      row.groupId,
      polygonLabelsById,
    );
    const vertexIndex = Number.isInteger(row.vertexIndex)
      ? row.vertexIndex + 1
      : null;

    return vertexIndex !== null
      ? `${polygonLabel} - V${vertexIndex}`
      : polygonLabel;
  }

  return "";
}
