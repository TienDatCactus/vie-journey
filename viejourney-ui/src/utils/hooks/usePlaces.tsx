import { useState, useCallback, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { POIData, AutocompleteOption } from "../../components/Maps/types";

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

export interface UsePlacesOptions {
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
}

/**
 * Unified hook that combines functionality from usePlacesAutocomplete,
 * useAutocompleteSuggestions, and usePlaces hooks
 */
export const usePlaces = ({
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
  ],
}: UsePlacesOptions = {}) => {
  // State for place search
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceDetails | null>(null);

  // State for POI interactions
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [highlightedPOI, setHighlightedPOI] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // References for Places API services
  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);

  // vis.gl Maps API
  const placesLib = useMapsLibrary("places");
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize direct Google Places service
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn(
        "Google Maps JavaScript API is not loaded - using vis.gl only"
      );
      return;
    }

    // Create a new session token when component mounts
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    autocompleteService.current = new google.maps.places.AutocompleteService();

    return () => {
      // Clean up token when component unmounts
      sessionToken.current = null;
    };
  }, []);

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

  // Function to get place suggestions using direct Google Maps API
  const getSuggestions = useCallback(
    async (input: string, options?: FilterOptions) => {
      if (!autocompleteService.current || !sessionToken.current || !input) {
        return;
      }

      setIsLoading(true);

      try {
        const request: google.maps.places.AutocompletionRequest = {
          input,
          sessionToken: sessionToken.current,
          // Default filter for regions/administrative areas
          types: options?.types || ["(regions)"],
        };

        // Add country restrictions if provided
        if (options?.componentRestrictions) {
          request.componentRestrictions = options.componentRestrictions;
        }

        const response = await new Promise<
          google.maps.places.AutocompletePrediction[]
        >((resolve, reject) => {
          autocompleteService.current!.getPlacePredictions(
            request,
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                resolve(predictions);
              } else {
                reject(status);
              }
            }
          );
        });

        // Transform predictions into our PlaceSuggestion format
        const formattedSuggestions = response.map((prediction) => ({
          placeId: prediction.place_id,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text,
          types: prediction.types,
        }));

        setSuggestions(formattedSuggestions);

        // Also convert to AutocompleteOption format for consistency
        const newOptions: AutocompleteOption[] = formattedSuggestions.map(
          (suggestion) => ({
            placeId: suggestion.placeId,
            primaryText: suggestion.mainText,
            secondaryText: suggestion.secondaryText,
          })
        );

        setOptions(newOptions);
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
        setSuggestions([]);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Function to get place suggestions using vis.gl
  useEffect(() => {
    if (!placesLib || !sessionTokenRef.current || inputValue === "") {
      return;
    }

    const { AutocompleteSuggestion } = placesLib;

    const request: google.maps.places.AutocompleteRequest = {
      input: inputValue,
      sessionToken: sessionTokenRef.current,
      ...filterOptions,
    };

    setIsLoading(true);

    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res: any) => {
        // Process suggestions into options
        if (res.suggestions?.length) {
          const newOptions: AutocompleteOption[] = res.suggestions
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
        } else {
          setOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching place suggestions with vis.gl:", error);
        setOptions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [placesLib, inputValue, filterOptions]);

  // Reset suggestions and create a new session token
  const resetSearch = useCallback(() => {
    setSuggestions([]);
    setOptions([]);
    setSelectedOption(null);
    setSelectedPlaceDetails(null);
    setInputValue("");

    // Reset both session tokens
    if (window.google?.maps?.places) {
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }

    if (placesLib) {
      const { AutocompleteSessionToken } = placesLib;
      sessionTokenRef.current = new AutocompleteSessionToken();
    }
  }, [placesLib]);

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.SyntheticEvent, value: string) => {
      setInputValue(value);

      if (selectedOption && value !== selectedOption.primaryText) {
        setSelectedOption(null);
        setSelectedPlaceDetails(null);
      }

      // Use direct Google API if available, otherwise rely on the vis.gl effect
      if (window.google?.maps?.places && value.length >= 2) {
        getSuggestions(value, filterOptions);
      }

      if (value.length >= 2) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    },
    [selectedOption, filterOptions, getSuggestions]
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

      onPlaceSelect?.(placeDetails);

      // Reset the session token after a selection is made
      if (window.google?.maps?.places) {
        sessionToken.current =
          new google.maps.places.AutocompleteSessionToken();
      }

      if (placesLib) {
        const { AutocompleteSessionToken } = placesLib;
        sessionTokenRef.current = new AutocompleteSessionToken();
      }

      return placeDetails;
    },
    [fetchPlaceDetails, placesLib, placeFields, onPlaceSelect, onPOIClick]
  );

  /**
   * Handle POI click from any source (search or map click)
   */
  const handlePOIClick = (poiData: POIData) => {
    setSelectedPOI(poiData);
    setHighlightedPOI(poiData.id);
    setIsDrawerOpen(true);

    if (onPOIClick) {
      onPOIClick(poiData);
    }
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
    // Autocomplete state
    inputValue,
    setInputValue,
    suggestions, // Direct Google API suggestions
    options, // Formatted options for Autocomplete component
    selectedOption,
    setSelectedOption,
    isLoading,
    open,
    setOpen,

    // Place details
    selectedPlaceDetails,

    // POI state
    selectedPOI,
    highlightedPOI,
    isDrawerOpen,

    // Actions
    handleInputChange,
    handlePlaceSelect,
    handlePOIClick,
    handleCloseDrawer,
    toggleDrawer,
    resetSearch,
    getSuggestions, // Direct access to the suggestion fetching method

    // Additional setters for state management
    setSelectedPOI,
    setHighlightedPOI,
    setIsDrawerOpen,
  };
};

export default usePlaces;
