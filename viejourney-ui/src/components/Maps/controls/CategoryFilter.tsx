import {
  Close,
  Search,
  TravelExplore,
  Tune,
  Clear,
  Place as PlaceIcon,
} from "@mui/icons-material";
import AttractionsIcon from "@mui/icons-material/Attractions";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EvStationIcon from "@mui/icons-material/EvStation";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ParkIcon from "@mui/icons-material/Park";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import useMapPlaces from "../../../utils/hooks/useMapPlaces";
import { AutocompleteOption } from "../types";

export interface CategoryType {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeTypes: string[];
  color: string;
}

export const PLACE_CATEGORIES: CategoryType[] = [
  {
    id: "food",
    label: "Food",
    icon: <RestaurantIcon className="text-red-500" />,
    placeTypes: ["restaurant", "meal_takeaway", "bakery", "cafe"],
    color: "#e53935", // Red
  },
  {
    id: "attractions",
    label: "Attractions",
    icon: <AttractionsIcon className="text-purple-500" />,
    placeTypes: [
      "tourist_attraction",
      "museum",
      "amusement_park",
      "aquarium",
      "art_gallery",
      "zoo",
    ],
    color: "#8e24aa", // Purple
  },
  {
    id: "gas",
    label: "Gas Stations",
    icon: <LocalGasStationIcon className="text-orange-500" />,
    placeTypes: ["gas_station"],
    color: "#f57c00", // Orange
  },
  {
    id: "ev",
    label: "EV Charging",
    icon: <EvStationIcon className="text-green-500" />,
    placeTypes: ["electric_vehicle_charging_station"],
    color: "#43a047", // Green
  },
  {
    id: "lodging",
    label: "Hotels",
    icon: <HotelIcon className="text-blue-500" />,
    placeTypes: ["lodging", "hotel", "campground"],
    color: "#1e88e5", // Blue
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: <CoffeeIcon className="text-brown-500" />,
    placeTypes: ["cafe"],
    color: "#795548", // Brown
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: <ShoppingCartIcon className="text-gray-500" />,
    placeTypes: [
      "shopping_mall",
      "department_store",
      "clothing_store",
      "convenience_store",
    ],
    color: "#9e9e9e", // Gray
  },
  {
    id: "parks",
    label: "Parks",
    icon: <ParkIcon className="text-green-500" />,
    placeTypes: ["park", "natural_feature", "campground"],
    color: "#4caf50", // Green
  },
  {
    id: "nightlife",
    label: "Nightlife",
    icon: <LocalBarIcon className="text-deep-purple-500" />,
    placeTypes: ["bar", "night_club"],
    color: "#673ab7", // Deep Purple
  },
];

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onPlaceSelected?: (place: any) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onCategoryToggle,
  onPlaceSelected,
}) => {
  // Configure useMapPlaces hook with Hanoi region restriction and proper debouncing
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
      types: ["establishment"], // Search for establishments
      componentRestrictions: {
        country: "vn", // Restrict to Vietnam
      },
      language: "en",
    },
    fetchPlaceDetails: true,
    debounceTimeout: 500, // Longer debounce to further reduce API calls
    autoFetch: false, // Disable auto-fetch to have more control over API calls
    onPlaceSelect: (placeDetails) => {
      if (onPlaceSelected && placeDetails?.place) {
        onPlaceSelected(placeDetails.place);
      }
    },
  });
  // Custom input change handler for better control over API calls
  const handleInputChangeCustom = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    // Update the UI with the new input value
    handleInputChange(event, value);

    // Only trigger suggestions when there's enough input (2+ characters)
    if (value && value.length >= 2) {
      // Use debounced getSuggestions function from the hook
      getSuggestions(value, {
        types: ["establishment"],
        componentRestrictions: {
          country: "vn", // Restrict to Vietnam
        },
        language: "en",
      });

      // Show dropdown when we have input
      setOpen(true);
    } else {
      // Hide dropdown when input is too short
      setOpen(false);
    }
  };
  // Handle place selection with any additional logic you need
  const handlePlaceSelectLocal = async (option: AutocompleteOption | null) => {
    if (!option) return;

    try {
      await handlePlaceSelect(option);
      // Close the dropdown after selection
      setOpen(false);
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  // Replace your TextField with this Autocomplete component
  return (
    <Paper
      elevation={3}
      className="absolute space-y-2 top-2 left-2 z-10 p-2 w-full max-w-100"
    >
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Stack direction={"row"} spacing={1} alignItems="center">
          <TravelExplore />
          <h1 className="text-xl font-bold">Explore Nearby</h1>
        </Stack>
        <IconButton>
          <Close />
        </IconButton>
      </Stack>
      {/* Replace your TextField with this Autocomplete */}{" "}
      <Autocomplete
        id="places-search"
        open={open}
        onOpen={() => {
          if (inputValue && inputValue.length >= 2) {
            setOpen(true);
          }
        }}
        onClose={() => setOpen(false)}
        options={options}
        loading={isLoading}
        getOptionLabel={(option) => option.primaryText}
        isOptionEqualToValue={(option, value) =>
          option.placeId === value.placeId
        }
        noOptionsText={inputValue ? "No places found" : "Type to search"}
        filterOptions={(x) => x} // Keep all options returned from the API
        onChange={(_event, value) => handlePlaceSelectLocal(value)}
        onInputChange={handleInputChangeCustom} // Use our custom handler
        inputValue={inputValue}
        value={selectedOption}
        clearOnBlur={false}
        popupIcon={null}
        fullWidth
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Type to search for places in Vietnam..."
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-dark-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {isLoading && <CircularProgress color="primary" size={20} />}{" "}
                  <IconButton
                    size="small"
                    onClick={() => {
                      resetSearch();
                      setOpen(false); // Make sure to close dropdown when cleared
                    }}
                    style={{
                      visibility: inputValue ? "visible" : "hidden",
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </React.Fragment>
              ),
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
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Stack direction={"row"} spacing={1} alignItems="center">
          <Tune />
          <h2 className="text-base font-semibold">Filters</h2>
        </Stack>
        <FormControl>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Switch />
            <FormLabel>
              <p className="text-sm text-gray-500">Open now</p>
            </FormLabel>
          </Stack>
        </FormControl>
      </Stack>
      <div>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <h2 className="text-base font-semibold">Search radius</h2>
          <p className="text-sm text-gray-500">5 km</p>
        </Stack>

        <Slider value={5000} min={0} max={20000} step={1000} disabled />
      </div>
      <FormControl>
        <Stack direction={"row"} spacing={1} alignItems="center">
          <FormLabel htmlFor="sort-by" className="text-base font-semibold">
            Sort by:
          </FormLabel>
          <Select
            variant="standard"
            className="w-40 text-sm text-gray-700"
            id="sort-by"
            defaultValue="distance"
            size="small"
          >
            <MenuItem value="distance">Distance</MenuItem>
            <MenuItem value="reviews">Reviews</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </Stack>
      </FormControl>
      <Divider />
      <div className="overflow-y-scroll relative max-h-40">
        <h1 className="text-base font-semibold">Categories</h1>
        {PLACE_CATEGORIES.map((category) => (
          <Tooltip key={category.id} title={category.label}>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems="center"
              padding={2}
              onClick={() => onCategoryToggle(category.id)}
              className={`shadow-sm my-2 hover:shadow-md border border-neutral-300 rounded-md transition-shadow duration-200 cursor-pointer ${
                selectedCategories.includes(category.id)
                  ? "bg-gray-200"
                  : "bg-white"
              }`}
            >
              <div>
                {React.cloneElement(category.icon as React.ReactElement, {})}
              </div>
              <Typography variant="caption">{category.label}</Typography>
            </Stack>
          </Tooltip>
        ))}
      </div>
    </Paper>
  );
};

export default CategoryFilter;
