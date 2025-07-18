import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

/**
 * A reusable hook that retrieves autocomplete suggestions from the Google Places API.
 * The data is loaded from the new Autocomplete Data API.
 * (https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
 *
 * @param inputString The input string for which to fetch autocomplete suggestions.
 * @param requestOptions Additional options for the autocomplete request
 *   (See {@link https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest}).
 *
 * @returns An object containing the autocomplete suggestions, the current loading-status,
 *   and a function to reset the session.
 *
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   const [input, setInput] = useState('');
 *   const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(input, {
 *     includedPrimaryTypes: ['restaurant']
 *   });
 *
 *   return (
 *     <div>
 *       <input value={input} onChange={(e) => setInput(e.target.value)} />
 *       <ul>
 *         {suggestions.map(({placePrediction}) => (
 *           <li key={placePrediction.placeId}>{placePrediction.text.text}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary("places");

  // stores the current sessionToken
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken>(null);

  // the suggestions based on the specified input
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);

  // indicates if there is currently an incomplete request to the places API
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the input
  const debouncedInput = useDebounce(inputString, 300); // 300ms delay

  // is sent to the Autocomplete Data API.
  useEffect(() => {
    if (!placesLib || debouncedInput === "") {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

    // Create a new session if one doesn't already exist. This has to be reset
    // after `fetchFields` for one of the returned places is called by calling
    // the `resetSession` function returned from this hook.
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const request: google.maps.places.AutocompleteRequest = {
      ...requestOptions,
      input: debouncedInput,
      sessionToken: sessionTokenRef.current,
    };

    setIsLoading(true);
    AutocompleteSuggestion.fetchAutocompleteSuggestions(request).then((res) => {
      setSuggestions(res.suggestions);
      setIsLoading(false);
    });
  }, [placesLib, debouncedInput]);

  // Lazy loading approach for place details

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    },
  };
}
