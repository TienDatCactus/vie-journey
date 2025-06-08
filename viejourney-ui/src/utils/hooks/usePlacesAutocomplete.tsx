import { useEffect, useState, useRef, useCallback } from "react";

interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

interface FilterOptions {
  types?: string[];
  componentRestrictions?: {
    country: string | string[];
  };
}

const usePlacesAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);

  // Initialize the Places service
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps JavaScript API is not loaded");
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

  // Function to get place suggestions
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
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Reset suggestions and create a new session token
  const reset = useCallback(() => {
    setSuggestions([]);
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();
  }, []);

  return {
    suggestions,
    isLoading,
    getSuggestions,
    reset,
  };
};

export default usePlacesAutocomplete;
