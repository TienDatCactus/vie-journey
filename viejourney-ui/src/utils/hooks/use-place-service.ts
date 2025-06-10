import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

/**
 * A hook to create and manage a single instance of PlacesService
 * and AutocompleteSessionToken for use across the app.
 */
export function usePlacesService() {
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");

  // References for Places API services
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Places Service and Session Token in a single effect
  useEffect(() => {
    // Reset refs for service and token when dependencies change
    placesServiceRef.current = null;

    // Only create a new session token if placesLib is available
    if (placesLib) {
      const { AutocompleteSessionToken } = placesLib;
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    // Create Places Service when both map and places library are available
    if (mapInstance && placesLib) {
      console.log("Creating Places Service with vis.gl");
      placesServiceRef.current = new placesLib.PlacesService(mapInstance);
    }
    // Fallback to legacy Google Maps API if vis.gl isn't fully loaded
    else if (mapInstance && window.google?.maps?.places) {
      console.log("Creating Places Service with legacy Google Maps API");
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        mapInstance
      );
    }

    return () => {
      placesServiceRef.current = null;
      sessionTokenRef.current = null;
    };
  }, [mapInstance, placesLib]);

  // Create a new session token
  const resetSessionToken = () => {
    if (placesLib) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }
  };

  return {
    placesService: placesServiceRef.current,
    sessionToken: sessionTokenRef.current,
    resetSessionToken,
    isPlacesServiceAvailable: !!placesServiceRef.current,
    isPlacesLibraryAvailable: !!placesLib,
    mapInstance,
  };
}
