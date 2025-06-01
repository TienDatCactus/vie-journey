import {
  Clear,
  NavigateNext,
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
import { useMap } from "@vis.gl/react-google-maps";
import { motion } from "motion/react";
import React, { useState } from "react";
import { SearchPlacesControlProps } from "../types";
import { usePlaceSearch } from "../../../services/contexts/PlaceSearchContext";

const SearchPlacesControl: React.FC<SearchPlacesControlProps> = ({
  onPlaceSelected,
  placeholder = "Search for places...",
}) => {
  const mapInstance = useMap();
  const [isClicked, setIsClicked] = useState(false);

  // Use the global place search context
  const {
    searchInput,
    options,
    isLoading,
    open,
    setOpen,
    selectedOption,
    handleInputChange,
    resetSearch,
    handlePlaceSelect,
  } = usePlaceSearch();

  // Custom handler for this component to also handle map panning
  const handlePlaceSelectWithMap = async (option: any) => {
    if (!option || !mapInstance) return;

    try {
      const place = await handlePlaceSelect(option);

      // Pan to the place location if map is available
      if (place?.location) {
        mapInstance.panTo(place.location);
        mapInstance.setZoom(16);
      }

      // Call the callback if provided
      if (onPlaceSelected && place) {
        onPlaceSelected(place);
      }
    } catch (error) {
      console.error("Error in handlePlaceSelectWithMap:", error);
    }
  };

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
            noOptionsText={searchInput ? "No places found" : "Type to search"}
            filterOptions={(x) => x}
            onChange={(_event, value) => handlePlaceSelectWithMap(value)}
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
                          onClick={() => resetSearch()}
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
    </Box>
  );
};

export default SearchPlacesControl;
