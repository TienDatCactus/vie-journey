import { useState } from "react";
import { POIData } from "../../components/Maps/types";

/**
 * Custom hook to handle all places-related functionality including POI clicks,
 * search, location handling, and places display.
 */
export const usePlaces = (options?: {
  onPOIClick?: (poiData: POIData) => void;
}) => {
  // State for selected POI
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [highlightedPOI, setHighlightedPOI] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * Handle POI click from any source (search or map click)
   */
  const handlePOIClick = (poiData: POIData) => {
    setSelectedPOI(poiData);
    setHighlightedPOI(poiData.id);
    setIsDrawerOpen(true);

    if (options?.onPOIClick) {
      options.onPOIClick(poiData);
    }
  };

  /**
   * Handle a place selected from search
   */
  const handlePlaceSelected = (place: google.maps.places.Place) => {
    handlePOIClick(place);
  };

  /**
   * Handle POI click from Google Maps
   * Handles both classic PlaceResult and modern Place formats
   */
  const handleGooglePOIClick = (place: any) => {
    handlePOIClick(place);
  };

  /**
   * Close the POI drawer
   */
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setHighlightedPOI(null);
      // Optionally clear selectedPOI after animation completes
      // setSelectedPOI(null);
    }, 300);
  };

  /**
   * Toggle the drawer open state
   */
  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setHighlightedPOI(null);
      }, 300);
    }
  };

  return {
    // State
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,

    // Actions
    handlePOIClick,
    handlePlaceSelected,
    handleGooglePOIClick,
    handleCloseDrawer,
    toggleDrawer,

    // State setters (in case you need direct access)
    setSelectedPOI,
    setHighlightedPOI,
    setIsDrawerOpen,
  };
};
