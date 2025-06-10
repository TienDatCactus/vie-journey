import { Close, Search, TravelExplore, Tune } from "@mui/icons-material";
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
import React, { useCallback, useState } from "react";
import { useAutocompleteSuggestions } from "../../../utils/hooks/use-autocomplete-suggestion";
import usePOI from "../../../utils/hooks/use-poi";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

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

interface GeneralFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

const GeneralFilter: React.FC<GeneralFilterProps> = ({
  selectedCategories,
  onCategoryToggle,
}) => {
  const placesLib = useMapsLibrary("places");
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [open, setOpen] = useState(false); // Use the hook with proper debouncing configuration
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination);
  const { handlePOIClick, setHighlightedPOI } = usePOI();
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setDestination(value);
    },
    []
  );
  const handlePlaceSelect = (
    suggestion: {
      placePrediction: google.maps.places.PlacePrediction | null;
    } | null
  ) => {
    if (suggestion?.placePrediction && placesLib) {
      const placeInstance = new placesLib.Place({
        id: suggestion.placePrediction.placeId,
      });
      console.log("placeInstance:", placeInstance);
      handlePOIClick(placeInstance);

      setHighlightedPOI(placeInstance.id);
      setDestination(suggestion.placePrediction.mainText + "");
      setOpen(false);
    }
  };
  return (
    <Paper
      elevation={3}
      className="absolute space-y-2 top-2 right-2 z-10 p-2 w-full max-w-80"
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
        id="destination-autocomplete"
        open={open}
        onOpen={() => {
          if (destination.length >= 2) setOpen(true);
        }}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) =>
          option.placePrediction?.placeId === value.placePrediction?.placeId
        }
        getOptionLabel={(option) => option.placePrediction?.mainText + ""}
        options={suggestions}
        loading={isLoading}
        value={selectedPlace}
        onChange={(_, newValue) => handlePlaceSelect(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            className="rounded-lg"
            size="small"
            fullWidth
            placeholder="e.g Ta xua, Sapa, Da Nang"
            variant="outlined"
            value={destination}
            onChange={handleInputChange}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.placePrediction?.placeId}>
            <Stack>
              <div className="font-medium">
                {option?.placePrediction?.mainText + ""}
              </div>
              <div className="text-sm text-gray-500">
                {option.placePrediction?.secondaryText != null
                  ? option.placePrediction?.secondaryText + ""
                  : option.placePrediction?.text + ""}
              </div>
            </Stack>
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

        <Slider
          value={5000}
          min={0}
          max={20000}
          step={1000}
          className="text-dark-800"
        />
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
      <div className="lg:h-50 relative">
        <h1 className="text-base font-semibold pb-2">Categories</h1>
        <div className="grid gap-1 lg:grid-cols-2 overflow-auto max-h-40 ">
          {PLACE_CATEGORIES.map((category) => (
            <Tooltip key={category.id} title={category.label}>
              <Stack
                direction={"row"}
                spacing={1}
                alignItems="center"
                padding={2}
                onClick={() => onCategoryToggle(category.id)}
                className={`shadow-sm  hover:shadow-md border border-neutral-300 rounded-md transition-shadow duration-200 cursor-pointer ${
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
        {/* Faded mask at the bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.9) 70%, rgba(255,255,255,1))",
          }}
        />
      </div>
    </Paper>
  );
};

export default GeneralFilter;
