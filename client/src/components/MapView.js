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
import { Fragment } from "react/jsx-runtime";

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
  savedPolygons = [],
  draftPolygonPoints = [],
  onMapClick,
  onSavedMarkerClick,
  isPolygonClosed = false,
  onClosePolygon,
  onSavedPolygonClick,
  selectedSavedPolygonId,
  selectedSavedObjectId,
}) {
  const defaultIcon = new L.Icon.Default();
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

  const selectedObjectIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
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

      {Array.isArray(savedPolygons)
        ? savedPolygons.map((poly) => (
            <Fragment key={poly.id}>
              <Polygon
                positions={poly.points.map((p) => [p.lat, p.lng])}
                pathOptions={{
                  color: poly.id === selectedSavedPolygonId ? "red" : "blue",
                  weight: poly.id === selectedSavedPolygonId ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => {
                    if (onSavedPolygonClick) onSavedPolygonClick(poly.id);
                  },
                }}
              />
              {poly.points.map((p, idx) => (
                <Marker
                  key={`${poly.id}-vertex-${idx}`}
                  position={[p.lat, p.lng]}
                  icon={vertexIcon}
                />
              ))}
            </Fragment>
          ))
        : null}

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

      {savedObjects.map((obj) => {
        const isSelected = obj.id === selectedSavedObjectId;

        return (
          <Marker
            key={obj.id}
            position={[obj.lat, obj.lng]}
            icon={isSelected ? selectedObjectIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                if (!onSavedMarkerClick) return;
                onSavedMarkerClick(obj.id);
              },
            }}
          />
        );
      })}

      {draftObjects.map((obj) => (
        <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={draftIcon} />
      ))}
    </MapContainer>
  );
}
