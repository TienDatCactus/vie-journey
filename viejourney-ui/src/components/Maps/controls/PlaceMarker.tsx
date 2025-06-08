import React from "react";
import {
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { POIData } from "../types";
import { PLACE_CATEGORIES, CategoryType } from "./CategoryFilter";

interface PlaceMarkerProps {
  place: POIData;
  onClick: (place: POIData) => void;
  isSelected?: boolean;
}

const getCategoryForPlace = (place: POIData): CategoryType | undefined => {
  if (!place.types || place.types.length === 0) {
    return undefined;
  }
  // Find the first matching category
  return PLACE_CATEGORIES.find((category) =>
    category.placeTypes.some((type) => place.types?.includes(type))
  );
};

const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  place,
  onClick,
  isSelected = false,
}) => {
  console.log(place);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const category = getCategoryForPlace(place);

  // Default color if no category match is found
  const markerColor = category?.color || "#9e9e9e";

  // Handle click on the marker
  const handleClick = () => {
    onClick(place);
  };

  return (
    <AdvancedMarker
      ref={markerRef}
      position={place.location}
      title={place.displayName}
      onClick={handleClick}
      zIndex={isSelected ? 1000 : undefined}
      className={`transition-transform duration-200 transform ${
        isSelected ? "scale-125" : "hover:scale-110"
      }`}
    >
      <div className={`rounded-full ${isSelected ? "shadow-lg" : "shadow-md"}`}>
        <Pin
          scale={isSelected ? 1.4 : 1.2}
          background={markerColor}
          glyphColor="#ffffff"
          borderColor="#ffffff"
        />
      </div>
    </AdvancedMarker>
  );
};

export default PlaceMarker;
