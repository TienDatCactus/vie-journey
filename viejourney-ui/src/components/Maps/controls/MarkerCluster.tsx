import React, { useState, useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { POIData } from "../types";
import PlaceMarker from "./PlaceMarker";

interface MarkerClusterProps {
  places: POIData[];
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
      if (!place.location) return false;
      const latLng = new google.maps.LatLng(place.location);
      return bounds.contains(latLng);
    });
  }, [mapInstance, places, isVisible]);

  // Fetch additional details only for places missing data
  useEffect(() => {
    if (!placesLib || visiblePlaces.length === 0 || !mapInstance) return;

    // Clear the detailed places first
    setDetailedPlaces([]);

    // Create a PlacesService instance
    const placesService = new placesLib.PlacesService(mapInstance);

    // Use a counter to track when all requests are done
    let completedRequests = 0;
    const tempDetailedPlaces: POIData[] = [];

    // Process each place
    visiblePlaces.forEach((place) => {
      placesService.getDetails(
        {
          placeId: place.id,
          fields: import.meta.env.VITE_MAP_FIELDS?.split(",") || [
            "name",
            "formatted_address",
            "geometry",
            "place_id",
            "photos",
            "rating",
            "types",
            "user_ratings_total",
          ],
        },
        (result, status) => {
          completedRequests++;

          if (status === placesLib.PlacesServiceStatus.OK && result) {
            // Convert PlaceResult to POIData format
            const poiData = {
              ...result,
              id: result.place_id,
              displayName: result.name || "",
              formattedAddress: result.formatted_address || "",
              location: result.geometry?.location,
              userRatingCount: result.user_ratings_total,
              types: result.types || [],
            };

            tempDetailedPlaces.push(poiData as POIData);
          } else {
            // If we can't get details, use the original place data
            tempDetailedPlaces.push(place);
          }

          // When all requests are done, update state
          if (completedRequests === visiblePlaces.length) {
            setDetailedPlaces(tempDetailedPlaces);
          }
        }
      );
    });
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
