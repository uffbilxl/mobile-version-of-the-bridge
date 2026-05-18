// Google Maps publishable client key. Safe to expose (restrict by referrer in Cloud Console).
export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  "AIzaSyCedITVlDbNVpLvVH7wM1Oix8L7qmMi66s";

export const BRIDGE_MAP_ID = "bridge_dark_map";

export const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#080d1f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8892B0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#030712" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1f35" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2d3a6e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#030712" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];