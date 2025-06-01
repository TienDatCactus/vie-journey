import { useState } from "react";

/**
 * Hook to handle map loading, errors, and geolocation functionality
 */
export const useMapLoader = (options?: {
  onLoad?: () => void;
  onError?: (error: Error) => void;
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Handle successful geolocation
   */
  const handleLocationFound = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setUserLocation({ lat: latitude, lng: longitude });
  };

  /**
   * Handle geolocation error
   */
  const handleLocationError = (error: GeolocationPositionError) => {
    const errorMsg = `Couldn't access your location: ${error.message}`;
    setLocationError(errorMsg);
    console.error(errorMsg);
    setTimeout(() => setLocationError(null), 5000); // Clear after 5 seconds
  };

  /**
   * Handle successful map load
   */
  const handleLoad = () => {
    setLoading(false);
    if (options?.onLoad) options.onLoad();
  };

  /**
   * Handle map loading error
   */
  const handleError = (error: unknown) => {
    setLoading(false);
    setError(error instanceof Error ? error : new Error(String(error)));
    if (options?.onError)
      options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
  };

  return {
    // State
    locationError,
    userLocation,
    loading,
    error,

    // Actions
    handleLocationFound,
    handleLocationError,
    handleLoad,
    handleError,

    // State setters
    setLocationError,
    setUserLocation,
    setLoading,
    setError,
  };
};
