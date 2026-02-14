import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMapEvents,
} from "react-leaflet";
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
  draftPolygonPoints = [],
  onMapClick,
  onSavedMarkerClick,
  selectedSavedObjectId,
  isPolygonClosed = false,
  onClosePolygon,
}) {
  const draftIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const vertexIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [18, 30],
    iconAnchor: [9, 30],
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

      {Array.isArray(draftPolygonPoints)
        ? draftPolygonPoints.map((p, idx) => {
            const isFirst = idx === 0;
            const canClose =
              isFirst && !isPolygonClosed && draftPolygonPoints.length >= 3;

            return (
              <Marker
                key={`vertex-${idx}`}
                position={[p.lat, p.lng]}
                icon={vertexIcon}
                eventHandlers={
                  canClose
                    ? {
                        click: () => {
                          if (onClosePolygon) onClosePolygon();
                        },
                      }
                    : undefined
                }
              />
            );
          })
        : null}

      {Array.isArray(draftPolygonPoints) && draftPolygonPoints.length >= 2 ? (
        isPolygonClosed ? (
          <Polygon positions={draftPolygonPoints.map((p) => [p.lat, p.lng])} />
        ) : (
          <Polyline positions={draftPolygonPoints.map((p) => [p.lat, p.lng])} />
        )
      ) : null}

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
