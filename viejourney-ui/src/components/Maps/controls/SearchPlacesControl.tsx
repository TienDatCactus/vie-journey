import {
  Clear,
  NavigateBefore,
  Place as PlaceIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useAutocompleteSuggestions } from "../hooks/use-autocomplete-suggestions";

interface SearchPlacesControlProps {
  onPlaceSelected?: (place: google.maps.places.Place) => void;
  placeholder?: string;
  width?: string | number;
}

// Interface for the option items shown in the Autocomplete dropdown
interface AutocompleteOption {
  placeId: string;
  primaryText: string;
  secondaryText?: string;
}

const SearchPlacesControl: React.FC<SearchPlacesControlProps> = ({
  onPlaceSelected,
  placeholder = "Search for places...",
}) => {
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(
    searchInput,
    {
      //   includedPrimaryTypes: ["restaurant", "tourist_attraction", "lodging"],
    }
  );

  useEffect(() => {
    if (!suggestions?.length) return;

    const newOptions: AutocompleteOption[] = suggestions
      .filter(
        ({ placePrediction }) =>
          placePrediction?.placeId && placePrediction?.text?.text
      )
      .map(({ placePrediction }) => ({
        placeId: placePrediction?.placeId!, // Non-null assertion because of the filter
        primaryText: placePrediction?.text?.text!, // Non-null assertion because of the filter
        secondaryText: placePrediction?.secondaryText?.text || "",
      }));

    setOptions(newOptions);
  }, [suggestions]);
  const handlePlaceSelect = async (option: AutocompleteOption | null) => {
    if (!option || !placesLib || !mapInstance) return;

    try {
      const { Place } = placesLib;

      const placeInstance = new Place({
        id: option.placeId,
      });

      // Fetch detailed place information
      const result = await placeInstance.fetchFields({
        fields: [
          "location",
          "displayName",
          "formattedAddress",
          "types",
          "photos",
          "rating",
          "userRatingCount",
          "priceLevel",
        ],
      });
      const place = result.place; // Pan to the place location
      if (place.location) {
        mapInstance.panTo(place.location);
        mapInstance.setZoom(16);
      }

      // Call the callback if provided
      if (onPlaceSelected) {
        onPlaceSelected(place);
      }

      // Reset the autocomplete session
      resetSession();

      // Set the display value to the selected place name
      setSearchInput(option.primaryText);
      setSelectedOption(option);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Handle input change
  const handleInputChange = (_event: React.SyntheticEvent, value: string) => {
    setSearchInput(value);
    // Clear selected option when input changes
    if (selectedOption && value !== selectedOption.primaryText) {
      setSelectedOption(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "absolute",
        top: 6,
        transform: "translateX(-50%)",
        left: "50%",
        zIndex: 5,
        width: 300,
      }}
    >
      {isClicked ? (
        <motion.div
          initial={{ width: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          animate={{ width: "100%", scale: 1 }}
          exit={{ width: 0, scale: 0.95 }}
        >
          <Autocomplete
            id="google-map-search"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            loading={isLoading}
            getOptionLabel={(option) => option.primaryText}
            isOptionEqualToValue={(option, value) =>
              option.placeId === value.placeId
            }
            noOptionsText={searchInput ? "No places found" : "Type to search"}
            filterOptions={(x) => x}
            onChange={(_event, value) => handlePlaceSelect(value)}
            onInputChange={handleInputChange}
            inputValue={searchInput}
            value={selectedOption}
            clearOnBlur={false}
            popupIcon={null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  className: "p-2",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-2xl" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <React.Fragment>
                      {isLoading && (
                        <CircularProgress color="primary" size={20} />
                      )}
                      <IconButton size="small">
                        <Clear
                          onClick={() => {
                            setSearchInput("");
                            setSelectedOption(null);
                            resetSession();
                          }}
                          sx={{
                            visibility: searchInput ? "visible" : "hidden",
                          }}
                        />
                      </IconButton>
                    </React.Fragment>
                  ),
                  sx: {
                    bgcolor: "white",
                    borderRadius: 1,
                    boxShadow: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: 1,
                    },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    py: 0.5,
                  }}
                >
                  <PlaceIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mr: 1.5, ml: 0.5, minWidth: 24 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" component="span">
                      {option.primaryText}
                    </Typography>
                    {option.secondaryText && (
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {option.secondaryText}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </li>
            )}
          />
        </motion.div>
      ) : (
        <Tooltip
          title="Search for places"
          arrow
          className="text-2xl text-neutral-800"
        >
          <IconButton
            className="shadow-md bg-neutral-100"
            onClick={() => setIsClicked(true)}
            size="large"
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      )}
      {isClicked && (
        <IconButton
          className="shadow-md bg-neutral-100 "
          onClick={() => setIsClicked(false)}
        >
          <NavigateBefore />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchPlacesControl;
