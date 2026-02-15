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
}) {
  if (loading) return <div>Loading Map Data...</div>;
  if (error) return <div>{error}</div>;

  function isRowSelected(row) {
    if (row.rowType === "Object") {
      return row.sourceId === selectedObjectId;
    }

    if (row.rowType === "PolygonVertex") {
      return row.groupId === selectedPolygonId;
    }

    return false;
  }

  return (
    <div style={{ overflowX: "auto", maxHeight: "100%" }}>
      <table className="map-data-table">
        <thead>
          <tr>
            <th>Object</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                cursor: "pointer",
                backgroundColor: isRowSelected(row) ? "#e0f7fa" : "transparent",
              }}
            >
              <td>{row.label}</td>
              <td>{row.latitude}</td>
              <td>{row.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
