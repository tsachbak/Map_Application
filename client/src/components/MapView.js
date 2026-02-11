import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * MapView component renders an interactive map using react-leaflet.
 */
export default function MapView() {
  return (
    <MapContainer
      center={[31.7683, 35.2137]}
      zoom={8}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
