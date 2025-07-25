import {
  Delete,
  Edit,
  LocationOn,
  OpenInNew,
  Search,
} from "@mui/icons-material";
import {
  Autocomplete,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useCallback, useState } from "react";
import { useAutocompleteSuggestions } from "../../../../src/utils/hooks/use-autocomplete-suggestion";
import { useFetchPlaceDetails } from "../../../../src/utils/hooks/use-fetch-place";
import { getPlacePhotoUrl } from "../../../../src/utils/handlers/utils";

interface PlaceNodeViewProps {
  node: {
    attrs: {
      place?: google.maps.places.Place;
      showDetails?: boolean;
    };
  };
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
  editor: any;
}

export const PlaceNodeViewComponent: React.FC<PlaceNodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const placesLib = useMapsLibrary("places");
  if (!placesLib) return null;

  const [inputValue, setInputValue] = useState(
    node.attrs.place?.displayName || ""
  );
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(!node.attrs.place?.id);
  const [open, setOpen] = useState(false);

  const { suggestions, isLoading } = useAutocompleteSuggestions(inputValue, {
    includedPrimaryTypes: [
      "tourist_attraction",
      "point_of_interest",
      "natural_feature",
      "locality",
      "establishment",
    ],
  });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setInputValue(value);
    },
    []
  );
  const { fetchPlaceDetail } = useFetchPlaceDetails();

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setOpen(true);
  }, []);

  // Delete the node
  const handleDelete = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const handlePlaceSelect = useCallback(
    async (
      suggestion: {
        placePrediction: google.maps.places.PlacePrediction | null;
      } | null
    ) => {
      if (!suggestion?.placePrediction) return;

      setSelectedPlace({ placePrediction: suggestion.placePrediction });
      setInputValue(suggestion.placePrediction.mainText?.toString() || "");
      setOpen(false);
      setLoading(true);

      try {
        const placeDetails = await fetchPlaceDetail(
          suggestion.placePrediction.placeId
        );

        if (placeDetails) {
          // Just update the node with place details
          updateAttributes({
            place: placeDetails,
            showDetails: node.attrs.showDetails || false,
          });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaceDetail, updateAttributes, node.attrs.showDetails]
  );

  const formatPriceLevel = (
    level?: google.maps.places.PriceLevel | number | null
  ): string => {
    if (level === undefined || level === null) return "";

    const numericLevel = typeof level === "number" ? level : Number(level);

    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 4) {
      return "";
    }

    return "$".repeat(numericLevel);
  };

  const renderPlaceDetails = () => {
    const { place } = node.attrs;

    if (loading) {
      return (
        <Card className="mt-2">
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={120} />
          </CardContent>
        </Card>
      );
    }

    if (!place) return null;

    return (
      <div className="mt-2 border border-gray-200 shadow-sm bg-white">
        <div className="grid lg:grid-cols-3 items-start justify-between">
          <div className="lg:col-span-2 p-4 space-y-4">
            <h1 className="text-xl font-semibold">{place.displayName}</h1>
            <div className="flex flex-wrap gap-1">
              {place.types &&
                place.types.map((type: string) => (
                  <Chip
                    key={`primary-${type}`}
                    label={type.replace(/_/g, " ")}
                    size="small"
                    color="primary"
                    className="text-sm bg-neutral-300 font-semibold text-dark-800"
                  />
                ))}
            </div>
            {!place.editorialSummary && place.businessStatus && (
              <h2 className="text-base font-light text-gray-600 m-0">
                {`${place.displayName} is a ${
                  place.types && place.types.slice(0, 2).join(" and ")
                } located in ${
                  place.formattedAddress?.split(",").slice(-2, -1)[0]?.trim() ||
                  "this area"
                }.${
                  place.rating
                    ? ` It has a rating of ${place.rating} based on ${place.userRatingCount} reviews.`
                    : ""
                }${
                  place.priceLevel
                    ? ` The price level is ${formatPriceLevel(
                        place.priceLevel
                      )}.`
                    : ""
                }`}
              </h2>
            )}
            {place.editorialSummary && (
              <h2 className="text-base font-light text-gray-600">
                {place.editorialSummary}
              </h2>
            )}
          </div>

          <div className="p-4 flex flex-col items-end gap-2">
            <div className="flex gap-1">
              <IconButton size="small" onClick={handleEdit} title="Edit place">
                <Edit fontSize="small" />
              </IconButton>

              {place.googleMapsURI && (
                <IconButton
                  size="small"
                  onClick={() =>
                    window.open(place.googleMapsURI || "", "_blank")
                  }
                  title="Open in Google Maps"
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              )}

              <IconButton
                size="small"
                onClick={handleDelete}
                title="Remove place"
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
            {place.photos && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                <div className="  overflow-hidden">
                  <img
                    src={getPlacePhotoUrl(place.photos[0])}
                    alt={`${place.displayName} - Photo 1`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <NodeViewWrapper className="place-node-wrapper my-4">
      {isEditing ? (
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Autocomplete
            className="flex-1 shadow-sm"
            id="destination-autocomplete"
            open={open}
            onOpen={() => {
              if (inputValue.length >= 2) setOpen(true);
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
                value={inputValue}
                className=""
                size="small"
                fullWidth
                placeholder="e.g Ta xua, Sapa, Da Nang"
                variant="outlined"
                onChange={handleInputChange}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
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
          {!node.attrs.place && (
            <IconButton
              onClick={handleDelete}
              title="Remove this section"
              className="shadow-sm"
            >
              <Delete />
            </IconButton>
          )}
        </Stack>
      ) : (
        <>
          {node.attrs.place ? (
            renderPlaceDetails()
          ) : (
            <div className="bg-gray-50 border border-gray-200  p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LocationOn className="text-gray-600" />
                  <Typography
                    variant="body1"
                    className="font-medium"
                  ></Typography>
                </div>
                <div className="flex gap-1">
                  <IconButton size="small" onClick={handleEdit}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDelete}>
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Allow content after the place card */}
      <NodeViewContent className="mt-4" />
    </NodeViewWrapper>
  );
};

export default PlaceNodeViewComponent;
