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
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick && onRowClick(row)}
              className={
                isRowSelected(row) ? "map-data-row selected" : "map-data-row"
              }
            >
              <td>{getRowLabel(row)}</td>
              <td>{formatCoordinate(row.latitude)}</td>
              <td>{formatCoordinate(row.longitude)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
