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
    if (!placesLib || visiblePlaces.length === 0) return;

    const fetchDetails = async () => {
      const detailedList: POIData[] = await Promise.all(
        visiblePlaces.map(async (place) => {
          try {
            const placeObj = new placesLib.Place({ id: place.id });
            const result = await placeObj.fetchFields({
              fields: [
                // Basic Info
                "id",
                "displayName",
                "photos",
                "types",
                "businessStatus",
                // Location & Address
                "location",
                "viewport",
                "formattedAddress",
                "adrFormatAddress",
                "addressComponents",
                "plusCode",

                // Contact & Operational
                "internationalPhoneNumber",
                "nationalPhoneNumber",
                "websiteURI",
                "regularOpeningHours",
                "utcOffsetMinutes",

                // Ratings & Pricing
                "rating",
                "userRatingCount",
                "priceLevel",

                // Qualitative & Amenities
                "reviews",
                "editorialSummary",
                "parkingOptions",
                "paymentOptions",
                "isReservable",
                "hasOutdoorSeating",
                "servesBreakfast",
                "servesLunch",
                "servesDinner",
                "servesCoffee",
                "servesBeer",
                "servesWine",
                "hasTakeout",
                "hasDelivery",
                "hasCurbsidePickup",
                "hasDineIn",
                "isGoodForChildren",
                "isGoodForGroups",
                "allowsDogs",
                "hasLiveMusic",
                "accessibilityOptions",
                "googleMapsURI",
              ],
            });

            return result.place as POIData;
          } catch (err) {
            console.error("Failed to fetch place", err);
            return place;
          }
        })
      );

      setDetailedPlaces(detailedList);
    };

    fetchDetails();
  }, [placesLib, visiblePlaces]);

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
