import { useEffect } from "react";
import { useAutocompleteSuggestions } from "../utils/hooks/use-autocomplete-suggestions";
import { AutocompleteOption } from "../components/Maps/types";
import usePlaceSearchStore from "../services/contexts/PlaceSearchContext";

export const usePlaceSearchAutocomplete = () => {
  // Get the search input from the store
  const searchInput = usePlaceSearchStore((state) => state.searchInput);
  const setOptions = usePlaceSearchStore((state) => state.setOptions);

  // Get suggestions using the custom hook
  const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(
    searchInput,
    {
      // You can add filters here if needed
      // includedPrimaryTypes: ["restaurant", "tourist_attraction", "lodging"],
    }
  );

  // Expose resetSession so we can use it when needed
  const resetSearch = usePlaceSearchStore((state) => state.resetSearch);

  // Update the original resetSearch to also resetSession
  useEffect(() => {
    const originalResetSearch = resetSearch;
    usePlaceSearchStore.setState({
      resetSearch: () => {
        originalResetSearch();
        resetSession();
      },
    });
  }, [resetSearch, resetSession]);

  // Update options when suggestions change
  useEffect(() => {
    if (!suggestions?.length) return;

    const newOptions: AutocompleteOption[] = suggestions
      .filter(
        ({ placePrediction }) =>
          placePrediction?.placeId && placePrediction?.text?.text
      )
      .map(({ placePrediction }) => ({
        placeId: placePrediction?.placeId!,
        primaryText: placePrediction?.text?.text!,
        secondaryText: placePrediction?.secondaryText?.text || "",
      }));

    setOptions(newOptions);
  }, [suggestions, setOptions]);

  return { isLoading };
};
