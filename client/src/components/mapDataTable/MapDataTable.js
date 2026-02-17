import "./MapDataTable.css";

/***
 * MapDataTable.js
 */
export default function MapDataTable({
  rows = [],
  loading = false,
  error = null,
  selectedObjectId = null,
  selectedPolygonId = null,
  onRowClick,
  getRowDisplayLabel,
}) {
  if (loading) return <div className="map-data-state">Loading Map Data...</div>;
  if (error) return <div className="map-data-state">{error}</div>;

  function getRowKey(row) {
    if (!row) return "row-unknown";

    if (row.rowType === "Object") {
      return `Object|${row.sourceId ?? "unknown"}`;
    }

    if (row.rowType === "PolygonVertex") {
      const vertexPart = Number.isInteger(row.vertexIndex)
        ? row.vertexIndex
        : "unknown";
      return `PolygonVertex|${row.groupId ?? "unknown"}|${vertexPart}`;
    }

    return `Unknown|${row.rowType ?? "unknown"}`;
  }

  function isRowSelected(row) {
    if (row.rowType === "Object") {
      return row.sourceId === selectedObjectId;
    }

    if (row.rowType === "PolygonVertex") {
      return row.groupId === selectedPolygonId;
    }

    return false;
  }

  function getRowLabel(row) {
    if (typeof getRowDisplayLabel === "function") {
      return getRowDisplayLabel(row);
    }

    return "-";
  }

  function formatCoordinate(value) {
    if (typeof value === "number") {
      return value.toFixed(6);
    }

    return "-";
  }

  function isPolygonVertexRow(row) {
    return row?.rowType === "PolygonVertex";
  }

  function isSamePolygonGroup(a, b) {
    return (
      isPolygonVertexRow(a) &&
      isPolygonVertexRow(b) &&
      a.groupId &&
      b.groupId &&
      a.groupId === b.groupId
    );
  }

  function getPolygonGroupClass(row, preRow, nextRow) {
    if (!isPolygonVertexRow(row)) return "";

    const samePrev = isSamePolygonGroup(row, preRow);
    const sameNext = isSamePolygonGroup(row, nextRow);

    if (!samePrev && sameNext) return "poly-row poly-group-start";
    if (samePrev && sameNext) return "poly-row poly-group-mid";
    if (samePrev && !sameNext) return "poly-row poly-group-end";
    return "poly-row poly-group-single";
  }

  return (
    <div className="map-data-table-wrapper">
      <table className="map-data-table">
        <thead>
          <tr>
            <th>Object</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const prevRow = index > 0 ? rows[index - 1] : null;
            const nextRow = index < rows.length - 1 ? rows[index + 1] : null;

            const polygonGroupClass = getPolygonGroupClass(
              row,
              prevRow,
              nextRow,
            );
            const selectedClass = isRowSelected(row) ? "selected" : "";

            return (
              <tr
                key={getRowKey(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`map-data-row ${selectedClass} ${polygonGroupClass}`.trim()}
              >
                <td>{getRowLabel(row)}</td>
                <td>{formatCoordinate(row.latitude)}</td>
                <td>{formatCoordinate(row.longitude)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
