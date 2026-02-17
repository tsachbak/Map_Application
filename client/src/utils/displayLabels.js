/**
 * Label helpers for objects/polygons displayed in panel and table views.
 */

export function buildLabelMap(items = [], prefix) {
  const map = new Map();
  if (!Array.isArray(items)) return map;

  items.forEach((item, index) => {
    if (!item?.id) return;
    map.set(item.id, `${prefix} #${index + 1}`);
  });

  return map;
}

export function getObjectDisplayLabelById(id, objectLabelsById) {
  return objectLabelsById.get(id) ?? "Object";
}

export function getPolygonDisplayLabelById(id, polygonLabelsById) {
  return polygonLabelsById.get(id) ?? "Polygon";
}

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
