"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import Link from "next/link";
import { Star, MapPin, Navigation } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface MapProvider {
  id: string;
  businessName: string;
  description: string | null;
  coverImage: string | null;
  city: string | null;
  averageRating: number | null;
  reviewCount: number;
  priceFrom: number | null;
  isVerified: boolean;
  isFeatured: boolean;
  categories: string[];
  geoLat?: number | null;
  geoLng?: number | null;
  slug?: string | null;
  distance?: number | null;
}

interface VendorMapProps {
  providers: MapProvider[];
}

/* ------------------------------------------------------------------ */
/*  Custom marker icon                                                  */
/* ------------------------------------------------------------------ */

const createCustomIcon = (isFeatured: boolean) =>
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
/*  Auto-fit bounds helper                                              */
/* ------------------------------------------------------------------ */

function FitBounds({ providers }: { providers: MapProvider[] }) {
  const map = useMap();

  useEffect(() => {
    const geoProviders = providers.filter(
      (p) => p.geoLat != null && p.geoLng != null
    );
    if (geoProviders.length === 0) return;

    if (geoProviders.length === 1) {
      map.setView(
        [geoProviders[0].geoLat!, geoProviders[0].geoLng!],
        13
      );
    } else {
      const bounds = L.latLngBounds(
        geoProviders.map((p) => [p.geoLat!, p.geoLng!] as L.LatLngTuple)
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [providers, map]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Popup card                                                          */
/* ------------------------------------------------------------------ */

function VendorPopup({ provider }: { provider: MapProvider }) {
  const profileHref = provider.slug
    ? `/vendors/${provider.slug}`
    : `/vendors/${provider.id}`;

  return (
    <div className="vendor-popup" style={{ minWidth: 220, maxWidth: 260 }}>
      {/* Cover image */}
      {provider.coverImage && (
        <div
          style={{
            width: "100%",
            height: 100,
            borderRadius: "8px 8px 0 0",
            backgroundImage: `url(${provider.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: 8,
          }}
        />
      )}

      <div style={{ padding: "0 4px 4px" }}>
        {/* Business name */}
        <h3
          style={{
            fontWeight: 700,
            fontSize: 14,
            margin: "0 0 4px",
            lineHeight: 1.3,
            color: "#1a1a1a",
          }}
        >
          {provider.businessName}
          {provider.isVerified && (
            <span
              title="Verified"
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                marginLeft: 4,
                verticalAlign: "middle",
                background: "#0891b2",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "14px",
                color: "white",
                fontSize: 9,
              }}
            >
              ✓
            </span>
          )}
        </h3>

        {/* City + distance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "#666",
            marginBottom: 6,
          }}
        >
          <MapPin size={11} />
          <span>{provider.city || "Location not set"}</span>
          {provider.distance != null && (
            <span
              style={{
                marginLeft: "auto",
                background: "#f0fdf4",
                color: "#16a34a",
                padding: "1px 6px",
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {provider.distance} mi
            </span>
          )}
        </div>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          <Star
            size={12}
            style={{ color: "#f59e0b", fill: "#f59e0b" }}
          />
          <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
            {provider.averageRating
              ? provider.averageRating.toFixed(1)
              : "New"}
          </span>
          <span style={{ color: "#999" }}>
            ({provider.reviewCount})
          </span>
          {provider.priceFrom != null && (
            <>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ fontWeight: 600, color: "#0891b2" }}>
                From £{provider.priceFrom.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* CTA */}
        <Link
          href={profileHref}
          style={{
            display: "block",
            textAlign: "center",
            padding: "6px 12px",
            background: "#0891b2",
            color: "white",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export default function VendorMap({ providers }: VendorMapProps) {
  const geoProviders = useMemo(
    () =>
      providers.filter(
        (p) => p.geoLat != null && p.geoLng != null
      ),
    [providers]
  );

  // Default center: London, UK
  const defaultCenter: [number, number] = [51.509865, -0.118092];
  const center: [number, number] =
    geoProviders.length > 0
      ? [geoProviders[0].geoLat!, geoProviders[0].geoLng!]
      : defaultCenter;

  if (geoProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-card/30 rounded-2xl border-2 border-dashed border-border/50">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <Navigation className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No map data available
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs text-center">
          None of the current search results have location coordinates. Try
          a different search or switch to list view.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Map info bar */}
      <div className="bg-card px-4 py-2.5 flex items-center justify-between text-xs border-b border-border">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {geoProviders.length}
          </span>{" "}
          vendor{geoProviders.length !== 1 ? "s" : ""} on map
          {providers.length > geoProviders.length && (
            <span className="ml-2 text-amber-600">
              ({providers.length - geoProviders.length} without coordinates)
            </span>
          )}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #0891b2, #0e7490)",
              }}
            />
            Vendor
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            />
            Featured
          </span>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds providers={geoProviders} />

        {geoProviders.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.geoLat!, provider.geoLng!]}
            icon={createCustomIcon(provider.isFeatured)}
          >
            <Popup maxWidth={280} minWidth={220} closeButton={true}>
              <VendorPopup provider={provider} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
