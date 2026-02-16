import L from "leaflet";

import jeepPng from "../../assets/symbols/jeep.png";
import shipPng from "../../assets/symbols/ship.png";
import airPlanPng from "../../assets/symbols/airplane.png";

/**
 * Defines symbol types and provides utility functions for handling map symbols.
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
 * Normalizes the given symbol type to a valid symbol type.
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
 * Returns a Leaflet icon for the given symbol type, or null if the type is "marker" or unrecognized.
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
 * Returns the URL of the symbol preview image for the given symbol type.
 */
export function getObjectSymbolPreviewUrl(type) {
  const normalizedType = normalizeSymbolType(type);

  if (normalizedType === SYMBOL_TYPES.MARKER) {
    return null;
  }

  const iconUrl = ICONS_BY_TYPE[normalizedType];
  return iconUrl ?? null;
}
