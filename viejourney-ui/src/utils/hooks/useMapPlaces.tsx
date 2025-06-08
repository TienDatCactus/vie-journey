import { useState, useCallback, useRef, useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { POIData, AutocompleteOption } from "../../components/Maps/types";
import {
  CategoryType,
  PLACE_CATEGORIES,
} from "../../components/Maps/controls/CategoryFilter";

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

export interface UseMapPlacesOptions {
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

  /** Whether to automatically fetch suggestions when input changes */
  autoFetch?: boolean;

  /** Debounce timeout in milliseconds */
  debounceTimeout?: number;
}

/**
 * A unified hook that combines places autocomplete, nearby search, and category-based search
 */
export const useMapPlaces = ({
  onPOIClick,
  onPlaceSelect,
  initialValue = "",
  filterOptions = {
    types: ["(regions)"],
    language: "en",
  },
  fetchPlaceDetails = false,
  placeFields = [
    "id",
    "displayName",
    "location",
    "viewport",
    "formattedAddress",
    "types",
    "photos",
    "rating",
    "userRatingCount",
    "priceLevel",
  ],
  searchRadius = 5000,
  maxResults = 20,
  autoFetch = true,
  debounceTimeout = 300,
}: UseMapPlacesOptions = {}) => {
  // Map instance and libraries
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");

  // ===== STATE =====

  // Autocomplete state
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceDetails | null>(null);

  // POI state
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [highlightedPOI, setHighlightedPOI] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Category search state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryResults, setCategoryResults] = useState<POIData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResultsPanel, setShowResultsPanel] = useState<boolean>(false);

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

  // For debouncing
  const debounceTimerRef = useRef<number | null>(null);

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

  // ===== AUTOCOMPLETE FUNCTIONS =====

  // Function to fetch place suggestions with the Places API
  const fetchSuggestions = useCallback(
    async (input: string, options?: FilterOptions) => {
      if (
        !placesLib ||
        !sessionTokenRef.current ||
        !input ||
        input.length < 2
      ) {
        return;
      }

      setIsLoading(true);

      try {
        const { AutocompleteSuggestion } = placesLib;

        const request: google.maps.places.AutocompleteRequest = {
          input,
          sessionToken: sessionTokenRef.current,
          ...(options || filterOptions),
        };

        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        if (response.suggestions?.length) {
          // Process suggestions into options
          const newOptions: AutocompleteOption[] = response.suggestions
            .filter(
              ({ placePrediction }: any) =>
                placePrediction?.placeId && placePrediction?.text?.text
            )
            .map(({ placePrediction }: any) => ({
              placeId: placePrediction?.placeId!,
              primaryText: placePrediction?.text?.text!,
              secondaryText: placePrediction?.secondaryText?.text || "",
            }));

          setOptions(newOptions);

          // Also transform into our PlaceSuggestion format for consistency with previous implementation
          const formattedSuggestions: PlaceSuggestion[] = newOptions.map(
            (option) => ({
              placeId: option.placeId,
              mainText: option.primaryText,
              secondaryText: option.secondaryText || "",
              types: [], // Note: types may not be available in the same way from AutocompleteSuggestion
            })
          );

          setSuggestions(formattedSuggestions);
        } else {
          setOptions([]);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
        setOptions([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [placesLib, filterOptions]
  );

  // Debounced version of fetchSuggestions that can be exported
  const getSuggestions = useCallback(
    (input: string, options?: FilterOptions) => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        fetchSuggestions(input, options);
      }, debounceTimeout);
    },
    [fetchSuggestions, debounceTimeout]
  );

  // Auto-fetch suggestions when input changes (if enabled)
  useEffect(() => {
    // Skip if autoFetch is disabled
    if (!autoFetch) return;

    // Skip if input is too short
    if (!inputValue || inputValue.length < 2) return;

    // Use getSuggestions with debouncing
    getSuggestions(inputValue);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [inputValue, autoFetch, getSuggestions]);

  // Reset suggestions and create a new session token
  const resetSearch = useCallback(() => {
    setSuggestions([]);
    setOptions([]);
    setSelectedOption(null);
    setSelectedPlaceDetails(null);
    setInputValue("");

    // Reset the session token
    if (placesLib) {
      const { AutocompleteSessionToken } = placesLib;
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    // Clear any pending debounce timer
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [placesLib]);
  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setInputValue(value);

      if (selectedOption && value !== selectedOption.primaryText) {
        setSelectedOption(null);
        setSelectedPlaceDetails(null);
      }

      // Clear any existing debounce timer
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }

      if (value.length >= 2) {
        setOpen(true);
        // No need to call anything here - the useEffect that depends on inputValue will handle it
      } else {
        setOpen(false);
      }
    },
    [selectedOption]
  );

  // Handle place selection
  const handlePlaceSelect = useCallback(
    async (option: AutocompleteOption | null) => {
      setSelectedOption(option);

      let placeDetails: PlaceDetails | null = null;

      if (!option) {
        setSelectedPlaceDetails(null);
        onPlaceSelect?.(null);
        return null;
      }

      placeDetails = { ...option };
      setInputValue(option.primaryText);

      if (fetchPlaceDetails && option && placesLib) {
        try {
          const { Place } = placesLib;
          const placeInstance = new Place({
            id: option.placeId,
          });

          // Fetch detailed place information
          const result = await placeInstance.fetchFields({
            fields: placeFields,
          });

          placeDetails = {
            ...option,
            place: result.place,
          };

          setSelectedPlaceDetails(placeDetails);

          // Also set as selected POI
          setSelectedPOI(result.place);
          setHighlightedPOI(result.place.id);

          if (onPOIClick) {
            onPOIClick(result.place);
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
      } else {
        setSelectedPlaceDetails(placeDetails);
      }

      onPlaceSelect?.(placeDetails); // Reset the session token after a selection is made
      if (placesLib) {
        const { AutocompleteSessionToken } = placesLib;
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      return placeDetails;
    },
    [fetchPlaceDetails, placesLib, placeFields, onPlaceSelect, onPOIClick]
  );

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

      // For each unique place, convert to POIData
      const processedResults: POIData[] = [];

      for (const place of uniqueResults) {
        if (place.place_id && place.geometry?.location) {
          // Transform each place into our POIData format
          const poiData: POIData = {
            id: place.place_id,
            displayName: place.name || "",
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            formattedAddress: place.vicinity || "",
            types: place.types || [],
            rating: place.rating,
            userRatingCount: place.user_ratings_total,
            photos: place.photos || [],
            // Add other fields if available
          } as unknown as POIData;

          processedResults.push(poiData);
        }
      }

      setCategoryResults(processedResults);
    } catch (err) {
      setSearchError("Error searching for places");
      console.error("Places search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, [mapInstance, getSelectedPlaceTypes]);

  // Search when categories change or map is ready
  useEffect(() => {
    if (
      mapInstance &&
      placesServiceRef.current &&
      selectedCategories.length > 0
    ) {
      searchPlacesInBounds();

      // Add listener for bounds changed
      const boundsChangedListener = mapInstance.addListener("idle", () => {
        searchPlacesInBounds();
      });

      return () => {
        google.maps.event.removeListener(boundsChangedListener);
      };
    } else {
      setCategoryResults([]);
    }
  }, [mapInstance, selectedCategories, searchPlacesInBounds]);

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
  }, []);

  // ===== POI INTERACTION FUNCTIONS =====

  // Handle POI click from any source (search or map click)
  const handlePOIClick = useCallback(
    (poiData: POIData) => {
      setSelectedPOI(poiData);
      setHighlightedPOI(poiData.id);
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
    // Map instance
    mapInstance,

    // Autocomplete state
    inputValue,
    setInputValue,
    suggestions,
    options,
    selectedOption,
    setSelectedOption,
    isLoading,
    open,
    setOpen,
    selectedPlaceDetails,

    // POI state
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,

    // Category search state
    selectedCategories,
    categoryResults,
    isSearching,
    searchError,
    showResultsPanel,
    setShowResultsPanel,

    // Nearby search state
    nearbyPlaces,
    nearbyError,

    // Autocomplete actions
    handleInputChange,
    handlePlaceSelect,
    resetSearch,
    getSuggestions,

    // POI actions
    handlePOIClick,
    handleCloseDrawer,
    toggleDrawer,

    // Category search actions
    handleCategoryToggle,
    searchPlacesInBounds,

    // Nearby search actions
    searchPlacesByType,
    clearResults,

    // Direct setters for state management
    setSelectedPOI,
    setHighlightedPOI,
    setIsDrawerOpen,
    setSelectedCategories,
  };
};

export default useMapPlaces;
