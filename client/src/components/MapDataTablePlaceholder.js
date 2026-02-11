import "./MapDataTablePlaceholder.css";

/***
 * MapDataTablePlaceholder.js
 */
export default function MapDataTablePlaceholder() {
  return (
    <table className="map-data-table-placeholder">
      <thead>
        <tr>
          <th>Object</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="3">No data yet</td>
        </tr>
      </tbody>
    </table>
  );
}
