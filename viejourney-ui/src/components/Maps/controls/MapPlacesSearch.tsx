import {
  Clear,
  NavigateNext,
  Place as PlaceIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMap } from "@vis.gl/react-google-maps";
import { motion } from "motion/react";
import React, { useState } from "react";
import { SearchPlacesControlProps, AutocompleteOption } from "../types";
import useMapPlaces from "../../../utils/hooks/useMapPlaces";

const MapPlacesSearch: React.FC<SearchPlacesControlProps> = ({
  onPlaceSelected,
  placeholder = "Search for places...",
}) => {
  const mapInstance = useMap();
  const [isClicked, setIsClicked] = useState(false);

  // Define state for place types
  const [primaryTypes, setPrimaryTypes] = useState<string[]>([]);
  // Use the map places hook with proper debouncing
  const {
    options,
    isLoading,
    open,
    setOpen,
    selectedOption,
    handleInputChange,
    resetSearch,
    handlePlaceSelect,
    inputValue,
    getSuggestions,
  } = useMapPlaces({
    filterOptions: {
      types: ["(regions)"],
      includedPrimaryTypes: primaryTypes.length > 0 ? primaryTypes : undefined,
      language: "en",
    },
    fetchPlaceDetails: true,
    debounceTimeout: 500, // Longer debounce timeout
    autoFetch: false, // Disable auto-fetch for more control
    onPlaceSelect: (placeDetails) => {
      if (onPlaceSelected && placeDetails?.place) {
        onPlaceSelected(placeDetails.place);
      }
    },
  });
  // Custom handler for this component to also handle map panning
  const handlePlaceSelectWithMap = async (
    option: AutocompleteOption | null
  ) => {
    if (!option || !mapInstance) return;

    try {
      const placeDetails = await handlePlaceSelect(option);

      // Pan to the place location if map is available
      if (placeDetails?.place?.location) {
        mapInstance.panTo(placeDetails.place.location);
        mapInstance.setZoom(16);
      }

      // Call the callback if provided
      if (onPlaceSelected && placeDetails?.place) {
        onPlaceSelected(placeDetails.place);
      }
    } catch (error) {
      console.error("Error in handlePlaceSelectWithMap:", error);
    }
  };

  // Custom input change handler with proper debouncing
  const handleInputChangeCustom = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    // Update UI with new input value
    handleInputChange(event, value);

    // Only fetch suggestions when there's enough input
    if (value && value.length >= 2) {
      // Use the current primary types filter
      getSuggestions(value, {
        types: ["(regions)"],
        includedPrimaryTypes:
          primaryTypes.length > 0 ? primaryTypes : undefined,
        language: "en",
      });

      // Show dropdown when we have input
      setOpen(true);
    } else {
      // Hide dropdown when input is too short
      setOpen(false);
    }
  };

  const placeTypes = [
    "parking",
    "shopping_mall",
    "restaurant",
    "cafe",
    "bar",
    "museum",
    "tourist_attraction",
    "gym",
  ];
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: 1,
        position: "absolute",
        top: 6,
        right: 10,
        zIndex: 5,
        width: 300,
      }}
    >
      {isClicked && (
        <IconButton
          className="shadow-md bg-neutral-100 "
          onClick={() => setIsClicked(false)}
        >
          <NavigateNext />
        </IconButton>
      )}
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
            noOptionsText={inputValue ? "No places found" : "Type to search"}
            filterOptions={(x) => x}
            onChange={(_event, value) => handlePlaceSelectWithMap(value)}
            onInputChange={handleInputChangeCustom}
            inputValue={inputValue}
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
                          onClick={() => resetSearch()}
                          sx={{
                            visibility: inputValue ? "visible" : "hidden",
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
          <FormControl fullWidth className="mt-2">
            <InputLabel id="types-label">Types</InputLabel>
            <Select
              labelId="types-label"
              id="types-select"
              multiple
              className="bg-neutral-50"
              value={primaryTypes}
              onChange={(e) => setPrimaryTypes(e.target.value as string[])}
              renderValue={(selected) =>
                selected && selected.length > 0
                  ? selected.includes("_")
                    ? selected.join(", ")
                    : selected
                        .map((type) =>
                          type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        )
                        .join(", ")
                  : "Select types"
              }
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                boxShadow: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: 1,
                },
              }}
            >
              {placeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={primaryTypes?.includes(type)} />
                  <ListItemText
                    primary={
                      (type.includes("_") &&
                        type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")) ||
                      type.charAt(0).toUpperCase() + type.slice(1)
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    </Box>
  );
};

export default MapPlacesSearch;
