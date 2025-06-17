import { useState, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useTripDetailStore } from "../../services/stores/useTripDetailStore";

export function useFetchPlaceDetails() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const placesLib = useMapsLibrary("places");
  const { placeDetails, setPlaceDetails } = useTripDetailStore();

  const fetchPlaceDetail = useCallback(
    async (placeId: string): Promise<google.maps.places.Place | undefined> => {
      // Check if we already have this place detail cached
      if (placeDetails[placeId]) {
        return placeDetails[placeId];
      }

      // Set loading state for this placeId
      setIsLoading((prev) => ({ ...prev, [placeId]: true }));

      try {
        if (!placesLib) {
          console.error("Places library not loaded");
          return undefined;
        }

        // This would typically be an API call to fetch place details
        // Using the Google Maps JavaScript API approach
        const placeResult = await new Promise<google.maps.places.Place>(
          (resolve, reject) => {
            const place = new placesLib.Place({ id: placeId });
            place
              .fetchFields({
                fields: import.meta.env.VITE_MAP_FIELDS
                  ? import.meta.env.VITE_MAP_FIELDS.split(",")
                  : [
                      "name",
                      "formattedAddress",
                      "rating",
                      "userRatingCount",
                      "photos",
                      "types",
                    ],
              })
              .then(
                (response) => {
                  console.log(response.place);
                  resolve(response.place);
                },
                (error) => reject(error)
              );
          }
        );

        // Store the place details in our state
        setPlaceDetails(placeId, placeResult);

        // Clear loading state
        setIsLoading((prev) => {
          const updated = { ...prev };
          delete updated[placeId];
          return updated;
        });

        return placeResult;
      } catch (error) {
        console.error("Error fetching place details:", error);

        // Clear loading state even on error
        setIsLoading((prev) => {
          const updated = { ...prev };
          delete updated[placeId];
          return updated;
        });

        return undefined;
      }
    },
    [placesLib, placeDetails, setPlaceDetails]
  );

  return {
    fetchPlaceDetail,
    isLoading: (placeId: string) => !!isLoading[placeId],
  };
}
