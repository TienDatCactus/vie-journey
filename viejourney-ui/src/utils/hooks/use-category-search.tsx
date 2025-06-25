import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CategoryType,
  PLACE_CATEGORIES,
} from "../../components/Maps/controls/GeneralFilter";
import { OldPOIData, POIData } from "../../components/Maps/types";
import { PlaceDetails } from "./use-poi";

export interface FilterOptions {
  types?: string[];
  componentRestrictions?: {
    country: string | string[];
  };
  language?: string;
  includedPrimaryTypes?: string[];
}

export interface UseCategorySearchOptions {
  /** Optional callback when a POI is clicked */
  onPOIClick?: (poiData: POIData) => void;

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
export const useCategorySearch = ({
  maxResults = 20,
  searchRadius = 5000, // Default radius for nearby search
}: UseCategorySearchOptions = {}) => {
  // Map instance and libraries
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");

  // ===== STATE =====
  // Category search state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryResults, setCategoryResults] = useState<OldPOIData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResultsPanel, setShowResultsPanel] = useState<boolean>(false);
  // New state to track if a search has been performed
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Nearby search state
  const [nearbyPlaces, setNearbyPlaces] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  // ===== REFS =====

  // References for Places API services
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // ===== INITIALIZATION =====
  // Initialize Places Service
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn(
        "Google Maps JavaScript API is not loaded - using vis.gl only"
      );
      return;
    }

    // If map is available, initialize places service
    if (mapInstance) {
      placesServiceRef.current = new google.maps.places.PlacesService(
        mapInstance
      );
    }

    return () => {
      placesServiceRef.current = null;
    };
  }, [mapInstance]);

  // Initialize vis.gl Places session token
  useEffect(() => {
    if (!placesLib) return;

    const { AutocompleteSessionToken } = placesLib;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    return () => {
      sessionTokenRef.current = null;
    };
  }, [placesLib]);

  // Initialize Places Service when map becomes available
  useEffect(() => {
    if (mapInstance && placesLib) {
      placesServiceRef.current = new placesLib.PlacesService(mapInstance);
    } else if (
      mapInstance &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      placesServiceRef.current = new google.maps.places.PlacesService(
        mapInstance
      );
    }
  }, [mapInstance, placesLib]);

  // ===== CATEGORY SEARCH FUNCTIONS =====

  // Get all place types from selected categories
  const getSelectedPlaceTypes = useCallback(() => {
    if (!selectedCategories.length) return [];

    return selectedCategories
      .map((categoryId) =>
        PLACE_CATEGORIES.find((category) => category.id === categoryId)
      )
      .filter((category): category is CategoryType => !!category)
      .flatMap((category) => category.placeTypes);
  }, [selectedCategories]);

  // Main category search function
  const searchPlacesInBounds = useCallback(async () => {
    if (!mapInstance || !placesServiceRef.current) {
      setSearchError("Maps or Places service not available");
      return;
    }

    // Get current map bounds
    const bounds = mapInstance.getBounds();
    if (!bounds) {
      setSearchError("Map bounds not available");
      return;
    }

    // If no categories are selected, clear results
    const placeTypes = getSelectedPlaceTypes();
    if (placeTypes.length === 0) {
      setCategoryResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Process multiple search requests, one for each place type
      const searchRequests = placeTypes.map((type) => {
        return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          const request: google.maps.places.PlaceSearchRequest = {
            bounds,
            type: type as string, // Place types are represented as strings in Google Maps API
          };

          placesServiceRef.current!.nearbySearch(request, (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              resolve(results);
            } else {
              resolve([]);
            }
          });
        });
      });

      // Wait for all requests to complete
      const allResults = await Promise.all(searchRequests);

      // Flatten and deduplicate results
      const flatResults = allResults.flat();
      const uniqueResults = Array.from(
        new Map(flatResults.map((place) => [place.place_id, place])).values()
      );
      // Remove duplicates based on place_id
      const processedResults: OldPOIData[] = [];

      for (const place of uniqueResults) {
        if (place.place_id && place.geometry?.location) {
          processedResults.push(place as OldPOIData);
        }
      }

      setCategoryResults(processedResults);
      setHasSearched(true); // Mark that a search has been performed
    } catch (err) {
      setSearchError("Error searching for places");
    } finally {
      setIsSearching(false);
    }
  }, [mapInstance, getSelectedPlaceTypes]);

  // REMOVED: The automatic search effect
  // Now we only trigger searches when the user explicitly requests them

  // Handle category selection toggle
  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      // If already selected, remove it; otherwise add it
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });

    // Show results panel when categories are selected
    setShowResultsPanel(true);
  }, []);

  // ===== NEARBY SEARCH FUNCTIONS =====

  // Search for places by type near a location
  const searchPlacesByType = useCallback(
    async (
      location: google.maps.LatLngLiteral,
      types: string[],
      clearExisting = true
    ) => {
      if (!placesServiceRef.current) {
        setNearbyError("Places service not initialized");
        return [];
      }

      setIsSearching(true);
      if (clearExisting) {
        setNearbyPlaces([]);
      }
      setNearbyError(null);

      try {
        // Split search into multiple requests if there are multiple types
        const allResults: google.maps.places.PlaceResult[] = [];

        // Limit to 1 request per type to avoid hitting quota
        for (const type of types.slice(0, 5)) {
          const request: google.maps.places.PlaceSearchRequest = {
            location,
            radius: searchRadius,
            type: type as string,
          };

          // We need to wrap this in a Promise because nearbySearch uses a callback
          const results = await new Promise<google.maps.places.PlaceResult[]>(
            (resolve, reject) => {
              placesServiceRef.current!.nearbySearch(
                request,
                (results, status) => {
                  if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    results
                  ) {
                    resolve(results);
                  } else if (
                    status ===
                    google.maps.places.PlacesServiceStatus.ZERO_RESULTS
                  ) {
                    resolve([]);
                  } else {
                    reject(new Error(`Places API error: ${status}`));
                  }
                }
              );
            }
          );

          // Add results to our collection
          allResults.push(...results);
        }

        // Remove duplicates based on place_id
        const uniqueResults = allResults.filter(
          (place, index, self) =>
            place.place_id &&
            index === self.findIndex((p) => p.place_id === place.place_id)
        );

        // Cap the number of results
        const limitedResults = uniqueResults.slice(0, maxResults);

        setNearbyPlaces(limitedResults);
        setIsSearching(false);
        return limitedResults;
      } catch (err) {
        console.error("Error searching for places:", err);
        setNearbyError((err as Error).message);
        setIsSearching(false);
        return [];
      }
    },
    [searchRadius, maxResults]
  );

  // Clear search results
  const clearResults = useCallback(() => {
    setNearbyPlaces([]);
    setNearbyError(null);
    setCategoryResults([]);
    setHasSearched(false);
  }, []);

  return {
    // Category search state
    selectedCategories,
    categoryResults,
    isSearching,
    searchError,
    showResultsPanel,
    setShowResultsPanel,
    hasSearched, // New state to track if a search has been performed

    // Nearby search state
    nearbyPlaces,
    nearbyError,

    // Category search actions
    handleCategoryToggle,
    searchPlacesInBounds, // This is now exposed for button-triggered searches

    // Nearby search actions
    searchPlacesByType,
    clearResults,

    setSelectedCategories,
  };
};

export default useCategorySearch;
