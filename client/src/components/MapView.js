import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMapEvents,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { getObjectLeafletIcon } from "../features/objects/symbolLibrary";

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

  const draftVertexIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [18, 30],
    iconAnchor: [9, 30],
  });

  const vertexIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
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

  function MapAutoResize() {
    const map = useMap();

    useEffect(() => {
      const t1 = setTimeout(() => map.invalidateSize(), 0);
      const t2 = setTimeout(() => map.invalidateSize(), 150);

      function handleResize() {
        map.invalidateSize();
      }

      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener("resize", handleResize);
      };
    }, [map]);

    return null;
  }

  function resolveObjectIcon(objType, { isSelected = false, isDraft = false }) {
    const type = String(objType ?? "marker").toLowerCase();

    if (type === "marker") {
      if (isDraft) return draftIcon;
      if (isSelected) return selectedObjectIcon;
      return defaultIcon;
    }

    return getObjectLeafletIcon(type) ?? defaultIcon;
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
      <MapAutoResize />
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
                icon={draftVertexIcon}
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
        const type = String(obj.type ?? "marker").toLowerCase();
        const isDefaultMarker = type === "marker";

        return (
          <Fragment key={obj.id}>
            {!isDefaultMarker && isSelected ? (
              <CircleMarker
                center={[obj.lat, obj.lng]}
                radius={22}
                pathOptions={{
                  color: "red",
                  weight: 3,
                  fillOpacity: 0,
                }}
              />
            ) : null}
            <Marker
              position={[obj.lat, obj.lng]}
              icon={resolveObjectIcon(obj.type, { isSelected })}
              eventHandlers={{
                click: () => {
                  if (!onSavedMarkerClick) return;
                  onSavedMarkerClick(obj.id);
                },
              }}
            />
          </Fragment>
        );
      })}

      {draftObjects.map((obj) => (
        <Marker
          key={obj.id}
          position={[obj.lat, obj.lng]}
          icon={resolveObjectIcon(obj.type, { isDraft: true })}
        />
      ))}
    </MapContainer>
  );
}
