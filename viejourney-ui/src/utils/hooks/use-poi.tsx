import { useCallback, useState } from "react";
import { AutocompleteOption, POIData } from "../../components/Maps/types";

export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails extends AutocompleteOption {
  place?: google.maps.places.Place;
}

export interface FilterOptions {
  types?: string[];
  componentRestrictions?: {
    country: string | string[];
  };
  language?: string;
  includedPrimaryTypes?: string[];
}

export interface UsePOIOptions {
  /** Optional callback when a POI is clicked */
  onPOIClick?: (poiData?: POIData) => void;

  /** Optional callback when a place is selected from autocomplete */
  onPlaceSelect?: (placeDetails: PlaceDetails | null) => void;

  /** Default input value */
  initialValue?: string;

  /** Filters to restrict the types of places shown */
  filterOptions?: FilterOptions;

  /** Whether to automatically fetch place details when a place is selected */
  fetchPlaceDetails?: boolean;

  /** Fields to fetch when getting place details */
  placeFields?: string[];

  /** For nearby search */
  searchRadius?: number;

  /** Maximum number of results */
  maxResults?: number;
}

/**
 * A unified hook that combines places autocomplete, nearby search, and category-based search
 */
export const usePOI = ({ onPOIClick }: UsePOIOptions = {}) => {
  // Map instance and libraries

  // ===== STATE =====
  // POI state
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [highlightedPOI, setHighlightedPOI] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ===== POI INTERACTION FUNCTIONS =====

  // Handle POI click from any source (search or map click)
  const handlePOIClick = useCallback(
    (poiData?: POIData) => {
      if (!poiData) {
        setSelectedPOI(null);
        setHighlightedPOI(null);
        setIsDrawerOpen(false);
        return;
      }
      setSelectedPOI(poiData);
      setHighlightedPOI(poiData?.id);
      setIsDrawerOpen(true);

      if (onPOIClick) {
        onPOIClick(poiData);
      }
    },
    [onPOIClick]
  );

  // Close the POI drawer
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setHighlightedPOI(null);
      // Optionally clear selectedPOI after animation completes
      // setSelectedPOI(null);
    }, 300);
  }, []);

  // Toggle the drawer open state
  const toggleDrawer = useCallback(
    (newOpen: boolean) => () => {
      setIsDrawerOpen(newOpen);
      if (!newOpen) {
        setTimeout(() => {
          setHighlightedPOI(null);
        }, 300);
      }
    },
    []
  );

  return {
    open,

    // POI state
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,

    // POI actions
    handlePOIClick,
    handleCloseDrawer,
    toggleDrawer,

    // Direct setters for state management
    setSelectedPOI,
    setHighlightedPOI,
    setIsDrawerOpen,
  };
};

export default usePOI;
