"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

// Fix Leaflet default icon broken by webpack/Next.js
// Only patch once
if (typeof L !== "undefined" && L.Icon && L.Icon.Default) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({ click(e) { onSelect(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const FlyToCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 15); }, [center, map]);
  return null;
};

/**
 * MapPickerInner — actual Leaflet map (loaded client-side only via MapPicker wrapper)
 * Props:
 *   mapLocation  — { lat, lng } | null
 *   onSelect     — (lat, lng) => void
 */
const MapPickerInner = ({ mapLocation, onSelect }) => {
  const center = mapLocation
    ? [mapLocation.lat, mapLocation.lng]
    : [18.4738, -77.9209]; // Default: Montego Bay, Jamaica

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {mapLocation && <Marker position={[mapLocation.lat, mapLocation.lng]} />}
      <MapClickHandler onSelect={onSelect} />
      {mapLocation && <FlyToCenter center={[mapLocation.lat, mapLocation.lng]} />}
    </MapContainer>
  );
};

export default MapPickerInner;
