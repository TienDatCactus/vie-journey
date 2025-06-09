import React, { useState, useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { POIData } from "../types";
import PlaceMarker from "./PlaceMarker";

interface MarkerClusterProps {
  places: POIData[];
  onPlaceClick: (place: POIData) => void;
  selectedPlace: POIData | null;
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({
  places,
  onPlaceClick,
  selectedPlace,
}) => {
  const mapInstance = useMap();
  const [isVisible, setIsVisible] = useState(false);

  // Delay rendering markers slightly for better performance
  useEffect(() => {
    setIsVisible(true);
  }, [places]);

  // If there are too many markers, only render the ones in the current view
  const visiblePlaces = useMemo(() => {
    if (!mapInstance || !isVisible || places.length === 0) return [];

    // If we're dealing with a small number of places, show them all
    if (places.length < 100) return places;

    // Otherwise, filter to show only places in the current map bounds
    const bounds = mapInstance.getBounds();
    if (!bounds) return places;

    return places.filter((place) => {
      if (!place.location) return false;
      const latLng = new google.maps.LatLng(place.location);
      return bounds.contains(latLng);
    });
  }, [mapInstance, places, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {visiblePlaces.map((place) => (
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
