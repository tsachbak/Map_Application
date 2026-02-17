import L from "leaflet";

import jeepPng from "../../assets/symbols/jeep.png";
import shipPng from "../../assets/symbols/ship.png";
import airPlanPng from "../../assets/symbols/airplane.png";

/**
 * Symbol type constants and icon helpers for map objects.
 */
export const SYMBOL_TYPES = Object.freeze({
  MARKER: "marker",
  JEEP: "jeep",
  SHIP: "ship",
  AIRPLANE: "airplane",
});

export const SYMBOL_TYPE_OPTIONS = Object.freeze([
  SYMBOL_TYPES.MARKER,
  SYMBOL_TYPES.JEEP,
  SYMBOL_TYPES.SHIP,
  SYMBOL_TYPES.AIRPLANE,
]);

/**
 * Normalizes unknown input to one of the supported symbol types.
 */
export function normalizeSymbolType(type) {
  const value = String(type ?? "")
    .trim()
    .toLowerCase();
  return SYMBOL_TYPE_OPTIONS.includes(value) ? value : SYMBOL_TYPES.MARKER;
}

const ICONS_BY_TYPE = Object.freeze({
  [SYMBOL_TYPES.JEEP]: jeepPng,
  [SYMBOL_TYPES.SHIP]: shipPng,
  [SYMBOL_TYPES.AIRPLANE]: airPlanPng,
});

const MARKER_ICON_URLS = Object.freeze({
  green:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  blue: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  red: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadow:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function createColoredMarkerIcon(iconUrl, iconSize, iconAnchor) {
  return new L.Icon({
    iconUrl,
    shadowUrl: MARKER_ICON_URLS.shadow,
    iconSize,
    iconAnchor,
  });
}

const defaultMarkerIcon = new L.Icon.Default();

const draftMarkerIcon = createColoredMarkerIcon(
  MARKER_ICON_URLS.green,
  [25, 41],
  [12, 41],
);

const selectedMarkerIcon = createColoredMarkerIcon(
  MARKER_ICON_URLS.red,
  [25, 41],
  [12, 41],
);

const draftVertexMarkerIcon = createColoredMarkerIcon(
  MARKER_ICON_URLS.green,
  [18, 30],
  [9, 30],
);

const vertexMarkerIcon = createColoredMarkerIcon(
  MARKER_ICON_URLS.blue,
  [18, 30],
  [9, 30],
);

export function getDefaultMarkerIcon() {
  return defaultMarkerIcon;
}

export function getDraftMarkerIcon() {
  return draftMarkerIcon;
}

export function getSelectedMarkerIcon() {
  return selectedMarkerIcon;
}

export function getDraftVertexMarkerIcon() {
  return draftVertexMarkerIcon;
}

export function getVertexMarkerIcon() {
  return vertexMarkerIcon;
}

/**
 * Returns a Leaflet icon for non-marker symbol types.
 */
export function getObjectLeafletIcon(type) {
  const normalizedType = normalizeSymbolType(type);

  if (normalizedType === SYMBOL_TYPES.MARKER) {
    return null;
  }

  const iconUrl = ICONS_BY_TYPE[normalizedType];
  if (!iconUrl) {
    return null;
  }

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

/**
 * Resolves the correct Leaflet icon for an object by type and state.
 */
export function resolveObjectLeafletIcon(
  type,
  { isSelected = false, isDraft = false } = {},
) {
  const normalizedType = normalizeSymbolType(type);

  if (normalizedType === SYMBOL_TYPES.MARKER) {
    if (isDraft) return getDraftMarkerIcon();
    if (isSelected) return getSelectedMarkerIcon();
    return getDefaultMarkerIcon();
  }

  return getObjectLeafletIcon(normalizedType) ?? getDefaultMarkerIcon();
}

/**
 * Returns the preview image URL for non-marker symbol types.
 */
export function getObjectSymbolPreviewUrl(type) {
  const normalizedType = normalizeSymbolType(type);

  if (normalizedType === SYMBOL_TYPES.MARKER) {
    return null;
  }

  const iconUrl = ICONS_BY_TYPE[normalizedType];
  return iconUrl ?? null;
}
