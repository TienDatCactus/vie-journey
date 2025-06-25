import React, { useState, useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { OldPOIData, POIData } from "../types";
import PlaceMarker from "./PlaceMarker";

interface MarkerClusterProps {
  places: OldPOIData[];
  onPlaceClick: (place?: POIData) => void;
  selectedPlace: POIData | null;
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({
  places,
  onPlaceClick,
  selectedPlace,
}) => {
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");
  const [isVisible, setIsVisible] = useState(false);
  const [detailedPlaces, setDetailedPlaces] = useState<POIData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Delay for performance
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, [places]);

  // Filter only visible places
  const visiblePlaces = useMemo(() => {
    if (!mapInstance || !isVisible || places.length === 0) return [];
    if (places.length < 100) return places;
    const bounds = mapInstance.getBounds();
    if (!bounds) return places;

    return places.filter((place) => {
      if (!place.geometry?.location) return false;
      const latLng = new google.maps.LatLng(place.geometry?.location);
      return bounds.contains(latLng);
    });
  }, [mapInstance, places, isVisible]);

  // Fetch additional details only for places missing data
  useEffect(() => {
    if (!placesLib || visiblePlaces.length === 0 || !mapInstance) return;
    setIsLoading(true);
    const tempDetailedPlaces: POIData[] = [];
    let completedRequests = 0;
    visiblePlaces.forEach((place) => {
      try {
        const placeId = place.place_id || "";

        const placeInstance = new placesLib.Place({ id: placeId });

        placeInstance
          .fetchFields({
            fields: import.meta.env.VITE_MAP_FIELDS.split(",")
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
          .then((res) => {
            tempDetailedPlaces.push(res.place);
          })
          .catch((error) => {
            console.error(
              `Error fetching details for place ${placeId}:`,
              error
            );
            tempDetailedPlaces.push(place as unknown as POIData);
          })
          .finally(() => {
            completedRequests++;
            if (completedRequests === visiblePlaces.length) {
              setDetailedPlaces(tempDetailedPlaces);
              setIsLoading(false);
            }
          });
      } catch (error) {
        console.error("Error processing place:", error);
        completedRequests++;
        tempDetailedPlaces.push(place as unknown as POIData);

        if (completedRequests === visiblePlaces.length) {
          setDetailedPlaces(tempDetailedPlaces);
          setIsLoading(false);
        }
      }
    });
    return () => {
      setDetailedPlaces([]);
      setIsLoading(false);
    };
  }, [placesLib, visiblePlaces, mapInstance]);
  if (!isVisible) return null;
  return (
    <>
      {detailedPlaces.map((place) => (
        <PlaceMarker
          key={place.id}
          place={place}
          onClick={onPlaceClick}
          isSelected={selectedPlace?.id === place.id}
        />
      ))}
    </>
  );
};

export default MarkerCluster;
