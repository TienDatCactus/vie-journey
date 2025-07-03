import { useState, useEffect } from "react";

interface DirectionsResult {
  distance: string;
  duration: string;
  polyline?: google.maps.LatLng[];
  url: string;
}

export function useDirections(
  originPlaceId: string,
  destinationPlaceId: string,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
) {
  const [result, setResult] = useState<DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originPlaceId || !destinationPlaceId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const directionsService = new google.maps.DirectionsService();

    directionsService
      .route({
        origin: { placeId: originPlaceId },
        destination: { placeId: destinationPlaceId },
        travelMode: travelMode,
      })
      .then((response) => {
        if (response.status === google.maps.DirectionsStatus.OK) {
          const route = response.routes[0];
          const leg = route.legs[0];

          setResult({
            distance: leg.distance?.text || "Unknown distance",
            duration: leg.duration?.text || "Unknown duration",
            polyline: google.maps.geometry.encoding.decodePath(
              route.overview_polyline
            ),
            url: `https://www.google.com/maps/dir/?api=1&origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&travelmode=${travelMode.toLowerCase()}`,
          });
        } else {
          setError("Error calculating directions");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [originPlaceId, destinationPlaceId, travelMode]);

  return { result, isLoading, error };
}
