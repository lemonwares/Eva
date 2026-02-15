"use client";

import { useState, useCallback } from "react";
import { logger } from "@/lib/logger";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionState | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
    permissionStatus: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          permissionStatus: "granted",
        });
      },
      (error) => {
        let errorMessage = "An unknown error occurred";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out";
            break;
        }
        setState({
          lat: null,
          lng: null,
          error: errorMessage,
          loading: false,
          permissionStatus: "denied",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  }, []);

  const checkPermission = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.permissions) {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation" as any,
        });
        setState((prev) => ({ ...prev, permissionStatus: result.state }));
        result.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: result.state }));
        };
      } catch (err) {
        logger.error("Error checking geolocation permission:", err);
      }
    }
  }, []);

  return { ...state, getLocation, checkPermission };
}
