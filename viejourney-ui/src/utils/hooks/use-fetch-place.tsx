import { useState, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export function useFetchPlaceDetails() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const placesLib = useMapsLibrary("places");
  const [placeDetails, setPlaceDetails] = useState<
    Record<string, google.maps.places.Place>
  >({});

  const fetchPlaceDetail = useCallback(
    async (placeId: string): Promise<google.maps.places.Place | undefined> => {
      if (placeDetails[placeId]) {
        return placeDetails[placeId];
      }

      setIsLoading((prev) => ({ ...prev, [placeId]: true }));

      try {
        if (!placesLib) {
          console.error("Places library not loaded");
          return undefined;
        }

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
                  resolve(response.place);
                },
                (error) => reject(error)
              );
          }
        );

        setPlaceDetails((prev) => ({ ...prev, [placeId]: placeResult }));
        return placeResult;
      } catch (error) {
        console.error("Error fetching place details:", error);
        return undefined;
      } finally {
        setIsLoading((prev) => {
          const updated = { ...prev };
          delete updated[placeId];
          return updated;
        });
      }
    },
    [placesLib, placeDetails]
  );

  return {
    fetchPlaceDetail,
    isLoading: (placeId: string) => !!isLoading[placeId],
    placeDetails,
  };
}
