import { Search } from "@mui/icons-material";
import AttractionsIcon from "@mui/icons-material/Attractions";
import CoffeeIcon from "@mui/icons-material/Coffee";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ParkIcon from "@mui/icons-material/Park";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { motion } from "motion/react";
import React, { useCallback, useState } from "react";
import { useAutocompleteSuggestions } from "../../../utils/hooks/use-autocomplete-suggestion";
import usePOI from "../../../utils/hooks/use-poi";

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
    icon: <RestaurantIcon />,
    placeTypes: ["restaurant", "meal_takeaway", "bakery", "cafe"],
    color: "#e53935", // Red
  },
  {
    id: "attractions",
    label: "Attractions",
    icon: <AttractionsIcon />,
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
    icon: <LocalGasStationIcon />,
    placeTypes: ["gas_station"],
    color: "#f57c00", // Orange
  },

  {
    id: "lodging",
    label: "Hotels",
    icon: <HotelIcon />,
    placeTypes: ["lodging", "hotel", "campground"],
    color: "#1e88e5", // Blue
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: <CoffeeIcon />,
    placeTypes: ["cafe"],
    color: "#795548", // Brown
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: <ShoppingCartIcon />,
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
    icon: <ParkIcon />,
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
  const mapInstance = useMap();
  const placesLib = useMapsLibrary("places");
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction | null;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination);
  const [loading] = useState(false);
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
    if (!suggestion?.placePrediction || !placesLib || !mapInstance) {
      return;
    }
    const placeInstance = new placesLib.Place({
      id: suggestion.placePrediction.placeId,
    });
    const location = placeInstance
      .fetchFields({
        fields: ["location"],
      })
      .then(
        (response) => {
          mapInstance.panTo({
            lat: response.place.location?.lat() || 0,
            lng: response.place.location?.lng() || 0,
          });
        },
        (error) => console.log(error)
      );
    if (!location) {
      console.error("Failed to fetch place details");
      return;
    }

    handlePOIClick(placeInstance);
    setHighlightedPOI(placeInstance.id);
    setDestination(suggestion.placePrediction.mainText + "");
    setOpen(false);
  };
  return (
    <>
      {openSearch ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute space-y-1  top-2 right-2 z-10 p-2 w-full max-w-80"
        >
          {/* Replace your TextField with this Autocomplete */}{" "}
          <Autocomplete
            id="destination-autocomplete"
            loadingText="Loading suggestions..."
            onBlur={() => setOpenSearch(false)}
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
            loading={loading}
            value={selectedPlace}
            onChange={(_, newValue) => handlePlaceSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                className=" "
                size="small"
                fullWidth
                placeholder="e.g Ta xua, Sapa, Da Nang"
                variant="outlined"
                value={destination}
                onChange={handleInputChange}
                InputProps={{
                  ...params.InputProps,
                  className: " bg-white ",
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
          <div className=" relative bg-white rounded-md py-2">
            <div className="grid grid-cols-1 overflow-auto max-h-40 ">
              {PLACE_CATEGORIES.map((category) => (
                <Tooltip key={category.id} title={category.label}>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    padding={1}
                    onClick={() => onCategoryToggle(category.id)}
                    className={` hover:shadow-md  transition-shadow duration-200  cursor-pointer ${
                      selectedCategories.includes(category.id)
                        ? "bg-gray-200"
                        : "bg-white"
                    }`}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <div>
                        {React.cloneElement(
                          category.icon as React.ReactElement,
                          {}
                        )}
                      </div>
                      <Typography variant="caption">
                        {category.label}
                      </Typography>
                    </Stack>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                    />
                  </Stack>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <IconButton
          className="absolute top-2 right-2 bg-white z-10"
          onClick={() => setOpenSearch(true)}
          size="large"
        >
          <Search />
        </IconButton>
      )}
    </>
  );
};

export default GeneralFilter;
