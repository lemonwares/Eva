"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface SingleVendorMapProps {
  lat: number;
  lng: number;
  isFeatured?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Custom marker icon                                                  */
/* ------------------------------------------------------------------ */

const createCustomIcon = (isFeatured?: boolean) =>
  L.divIcon({
    className: "vendor-marker",
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${isFeatured ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #0891b2, #0e7490)"};
        border: 3px solid white;
        border-radius: 50% 50% 50% 4px;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(45deg); fill: white;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

/* ------------------------------------------------------------------ */
/*  Center map manually if coordinates change                           */
/* ------------------------------------------------------------------ */

// Function to smoothly fly to position if coordinates change
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function SingleVendorMap({
  lat,
  lng,
  isFeatured = false,
}: SingleVendorMapProps) {
  // If no lat/lng, component shouldn't be rendered, but just in case:
  if (!lat || !lng) return null;

  return (
    <div style={{ height: "100%", width: "100%", zIndex: 0, position: "relative" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={lat} lng={lng} />
        <Marker
          position={[lat, lng]}
          icon={createCustomIcon(isFeatured)}
        />
      </MapContainer>
    </div>
  );
}
