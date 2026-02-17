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
