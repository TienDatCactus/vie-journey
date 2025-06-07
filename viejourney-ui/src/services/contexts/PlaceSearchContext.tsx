import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { AutocompleteOption } from "../../components/Maps/types";
import usePlaces from "../../utils/hooks/usePlaces";

interface PlaceSearchContextType {
  searchInput: string;
  setSearchInput: (input: string) => void;
  options: AutocompleteOption[];
  selectedOption: AutocompleteOption | null;
  setSelectedOption: (option: AutocompleteOption | null) => void;
  isLoading: boolean;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  handlePlaceSelect: (
    option: AutocompleteOption | null
  ) => Promise<google.maps.places.Place | null>;
  handleInputChange: (event: React.SyntheticEvent, value: string) => void;
  resetSearch: () => void;
  selectedPlace: google.maps.places.Place | null;
  setPrimaryTypes: (types: string[] | null) => void;
  primaryTypes: string[] | null;
}

export const PlaceSearchContext = createContext<
  PlaceSearchContextType | undefined
>(undefined);

interface PlaceSearchProviderProps {
  children: ReactNode;
}

export const PlaceSearchProvider: React.FC<PlaceSearchProviderProps> = ({
  children,
}) => {
  const placesLib = useMapsLibrary("places");
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null);
  const [primaryTypes, setPrimaryTypes] = useState<string[] | null>([]);
  const { suggestions, isLoading, resetSearch } = usePlaces({
    initialValue: searchInput,
    filterOptions: {
      language: "en",
      includedPrimaryTypes: [...(primaryTypes || [])],
    },
  });

  React.useEffect(() => {
    if (!suggestions?.length) return;

    const newOptions: AutocompleteOption[] = suggestions
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
  }, [suggestions]);

  const handlePlaceSelect = useCallback(
    async (option: AutocompleteOption | null) => {
      if (!option || !placesLib) return null;

      try {
        const { Place } = placesLib;
        const placeInstance = new Place({
          id: option.placeId,
        });

        // Fetch detailed place information
        const result = await placeInstance.fetchFields({
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
            "accessibilityOptions",
            "googleMapsURI",
          ],
        });

        const place = result.place;
        setSelectedPlace(place);

        // Set the display value to the selected place name
        setSearchInput(option.primaryText);
        setSelectedOption(option);

        // Reset the autocomplete session
        resetSearch();

        return place;
      } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
      }
    },
    [placesLib, resetSearch]
  );

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setSearchInput(value);
      if (selectedOption && value !== selectedOption.primaryText) {
        setSelectedOption(null);
      }
    },
    [selectedOption]
  );

  return (
    <PlaceSearchContext.Provider
      value={{
        searchInput,
        setSearchInput,
        options,
        selectedOption,
        setSelectedOption,
        isLoading,
        open,
        setOpen,
        handlePlaceSelect,
        handleInputChange,
        resetSearch,
        selectedPlace,
        setPrimaryTypes,
        primaryTypes,
      }}
    >
      {children}
    </PlaceSearchContext.Provider>
  );
};

export const usePlaceSearch = () => {
  const context = useContext(PlaceSearchContext);
  if (context === undefined) {
    throw new Error("usePlaceSearch must be used within a PlaceSearchProvider");
  }
  return context;
};
