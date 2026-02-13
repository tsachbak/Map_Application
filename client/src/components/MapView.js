import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * MapView component renders an interactive map using react-leaflet.
 */
export default function MapView({
  savedObjects = [],
  draftObjects = [],
  onMapClick,
  onSavedMarkerClick,
  selectedSavedObjectId,
}) {
  const draftIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (!onMapClick) return;

        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      },
    });
    return null;
  }

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

      <MapClickHandler />

      {savedObjects.map((obj) => (
        <Marker
          key={obj.id}
          position={[obj.lat, obj.lng]}
          eventHandlers={{
            click: () => {
              if (!onSavedMarkerClick) return;
              onSavedMarkerClick(obj.id);
            },
          }}
        />
      ))}

      {draftObjects.map((obj) => (
        <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={draftIcon} />
      ))}
    </MapContainer>
  );
}
