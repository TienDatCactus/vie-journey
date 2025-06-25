import {
  AccessTime,
  AttachMoney,
  BrowserNotSupported,
  Delete,
  Directions,
  DoDisturb,
  Edit,
  ExpandMore,
  MoreHoriz,
  OpenInNew,
  Place,
  Save,
  Star,
  TaskAlt,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PlaceNote } from "../../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { useAutocompleteSuggestions } from "../../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useFetchPlaceDetails } from "../../../../../../../utils/hooks/use-fetch-place";
import { useAuthStore } from "../../../../../../../services/stores/useAuthStore";
import { UserInfo } from "../../../../../../../utils/interfaces";
import { motion, useAnimation } from "motion/react";
function getPlacePhotoUrl(photo: any): string {
  const fallbackImage = "/images/placeholder-main.png";
  if (!photo) return fallbackImage;

  try {
    // Method 1: Try getUrl() with maxWidth parameter (standard Google Maps JS API v3 approach)
    if (typeof photo.getUrl === "function") {
      try {
        return photo.getUrl({ maxWidth: 800 });
      } catch (e) {
        console.log("getUrl with params failed", e);
      }
    }

    // Method 2: Try getUrl() without parameters (some API versions)
    if (typeof photo.getUrl === "function") {
      try {
        return photo.getUrl();
      } catch (e) {
        console.log("getUrl without params failed", e);
      }
    }

    // Method 3: Try getURI method (older or custom implementations)
    if (typeof photo.getURI === "function") {
      try {
        return photo.getURI();
      } catch (e) {
        console.log("getURI failed", e);
      }
    }

    // Method 4: Check if photo is a string URL directly
    if (typeof photo === "string") {
      return photo;
    }

    // Method 5: Check for common URL properties
    if (photo.url) return photo.url;

    // Method 6: Check if there's a photo reference we can use with Places Photo API
    if (photo.name || photo.photoReference || photo.photo_reference) {
      const photoRef =
        photo.name || photo.photoReference || photo.photo_reference;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
      if (photoRef && apiKey) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
      }
    }

    // Return fallback if all methods fail
    return fallbackImage;
  } catch (error) {
    console.error("Error getting photo URL:", error);
    return fallbackImage;
  }
}
interface PlaceCardProps {
  placeNote: PlaceNote;
  placeDetail?: google.maps.places.Place;
  onUpdateNote: (id: string, note: string, visited: boolean) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onFetchDetails: (
    placeId: string
  ) => Promise<google.maps.places.Place | undefined>;
  isLoading?: boolean;
}

const PlacesFinder = ({
  onAddPlace,
}: {
  onAddPlace: (placeId: string, name: string) => void;
}) => {
  const placesLib = useMapsLibrary("places");
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination, {
    includedPrimaryTypes: ["point_of_interest"],
  });

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
      setSelectedPlace({ placePrediction: suggestion.placePrediction });
      console.log("Selected Place:", suggestion.placePrediction.placeId);

      const placeId = suggestion.placePrediction.placeId || "";
      const name = String(suggestion.placePrediction.mainText || "");
      if (placeId) {
        onAddPlace(placeId, name);
      }

      setDestination("");
      setSelectedPlace(null);
      setOpen(false);
    }
  };

  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      place: "",
    },
  });

  return (
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
          value={destination}
          className="rounded-lg"
          size="small"
          fullWidth
          placeholder="Add a place to visit..."
          variant="outlined"
          {...register("place", {
            required: "place is required",
          })}
          error={!!errors.place}
          helperText={errors.place ? errors.place.message : ""}
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            className: "rounded-lg py-2 border-gray-300",
            startAdornment: (
              <InputAdornment position="start">
                <Place color={errors.place ? "error" : "action"} />
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
  );
};
const PlaceCard: React.FC<PlaceCardProps> = ({
  placeNote,
  placeDetail,
  onUpdateNote,
  onToggleEdit,
  onDelete,
  onToggleVisited,
  onFetchDetails,
  isLoading,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(isLoading || false);
  const [details, setDetails] = useState<google.maps.places.Place | undefined>(
    placeDetail
  );
  const [localContent, setLocalContent] = useState({
    note: placeNote.note,
    visited: placeNote.visited,
  });

  const open = Boolean(anchorEl);
  let duration = 20;
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        },
      },
    });
  }, [controls, placeDetail?.types]);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!placeDetail && !loading) {
        setLoading(true);
        try {
          const fetchedDetails = await onFetchDetails(placeNote.placeId);
          setDetails(fetchedDetails);
        } catch (err) {
          console.error("Error fetching details:", err);
        } finally {
          setLoading(false);
        }
      } else if (placeDetail) {
        setDetails(placeDetail);
      }
    };

    fetchDetails();
  }, [placeDetail, placeNote.placeId, onFetchDetails]);

  useEffect(() => {
    if (placeNote.isEditing) {
      setLocalContent({
        note: placeNote.note,
        visited: placeNote.visited,
      });
    }
  }, [placeNote.note, placeNote.visited, placeNote.isEditing]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSave = () => {
    onUpdateNote(placeNote._id, localContent.note, localContent.visited);
    onToggleEdit(placeNote._id);
  };

  const handleCancel = () => {
    // Just exit edit mode without saving
    onToggleEdit(placeNote._id);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent((prev) => ({
      ...prev,
      note: e.target.value,
    }));
  };

  return (
    <Card
      elevation={0}
      className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-64 z-20 flex-col "
    >
      {loading ? (
        // Loading state rendering
        <CardContent className="col-span-3 flex justify-center items-center">
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading place details...
          </Typography>
        </CardContent>
      ) : (
        <>
          <CardMedia
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/300x500?text=Image+not+available`;
            }}
            component="img"
            src={
              details?.photos && details.photos.length > 0
                ? getPlacePhotoUrl(details.photos[0]) // Use our helper function
                : "/images/placeholder-main.png"
            }
            className="object-cover col-span-1 w-full h-full rounded-s-lg"
          />
          <CardContent className="p-0 px-4 lg:py-1 flex flex-col col-span-2 justify-between z-20">
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Tooltip title={details?.displayName}>
                  <h1 className="text-2xl line-clamp-2 font-semibold">
                    {details?.displayName}
                  </h1>
                </Tooltip>
                {details?.types && (
                  <Chip
                    label={details?.types[0]
                      .split("_")
                      .map(
                        (item) => item.charAt(0).toUpperCase() + item.slice(1)
                      )
                      .join(" ")}
                    size="small"
                    className="bg-white border border-neutral-500 font-medium"
                  />
                )}
              </Stack>
              <IconButton className="p-1" onClick={handleMenuClick}>
                <MoreHoriz />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onToggleEdit(placeNote._id);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Notes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onDelete(placeNote._id);
                  }}
                >
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Stack direction={"row"} alignItems={"baseline"}>
                <Star className="text-yellow-500 text-base " />
                <span className="text-base text-gray-600 font-semibold ml-1">
                  {details?.rating ? details.rating : "None"}
                </span>
                <span className="text-xs text-gray-600 ">
                  ({details?.userRatingCount ? details.userRatingCount : "0"})
                </span>
              </Stack>
              <Stack direction={"row"} alignItems={"center"}>
                <AccessTime className="text-gray-600 text-base mr-0.5" />
                <span className="text-sm text-gray-600">
                  {details?.regularOpeningHours?.periods[0]?.open?.hour ? (
                    <div>
                      {details?.regularOpeningHours?.periods[0]?.open?.hour}AM -{" "}
                      {details?.regularOpeningHours?.periods[0]?.close?.minute}
                      PM
                    </div>
                  ) : (
                    <div>Closed</div>
                  )}
                </span>
              </Stack>
              <Stack direction={"row"} alignItems={"center"}>
                <AttachMoney className="text-green-600 text-base" />
                <span className="text-sm text-gray-600 font-semibold">
                  {details?.priceLevel ? details.priceLevel : "NO INFO"}
                </span>
              </Stack>
            </Stack>
            {!placeNote.isEditing ? (
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <h5 className="text-sm font-semibold">Notes* :</h5>
                <p className="text-base text-neutral-800 text-ellipsis line-clamp-3">
                  {placeNote.note || "No description provided."}
                </p>
              </Stack>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a description..."
                variant="standard"
                size="small"
                value={localContent.note}
                onChange={handleChange}
                slotProps={{
                  input: {
                    className:
                      "text-neutral-800 text-sm border-none no-underline",
                  },
                }}
              />
            )}
            {details?.editorialSummary && (
              <i className="text-sm text-gray-600">
                {details?.editorialSummary}
              </i>
            )}
            <div className="max-w-full overflow-hidden">
              <motion.div
                className="flex gap-2 z-10 whitespace-nowrap"
                animate={controls}
              >
                {!!details?.types?.length && (
                  <>
                    {details.types.map((type) => (
                      <Chip
                        key={type}
                        label={type
                          .split("_")
                          .map(
                            (item) =>
                              item.charAt(0).toUpperCase() + item.slice(1)
                          )
                          .join(" ")}
                        size="small"
                        className="text-xs"
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </div>
            <Divider className="" />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                {!placeNote.isEditing ? (
                  <>
                    {placeNote?.visited ? (
                      <TaskAlt className="text-lg" />
                    ) : (
                      <BrowserNotSupported className="text-lg" />
                    )}
                    <Chip
                      className={`${
                        placeNote?.visited
                          ? "bg-green-200  text-green-800 font-medium"
                          : "bg-red-200 text-red-800 font-medium"
                      }`}
                      label={placeNote?.visited ? "Visited" : "Not Visited"}
                      size="small"
                    />
                  </>
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localContent.visited}
                        onChange={() =>
                          setLocalContent((prev) => ({
                            ...prev,
                            visited: !prev.visited,
                          }))
                        }
                        color="success"
                      />
                    }
                    label="Visited"
                  />
                )}
              </Stack>
              {!placeNote.isEditing ? (
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    className="text-gray-600 border-gray-300"
                    startIcon={<Directions />}
                    onClick={() => {
                      if (details?.googleMapsURI) {
                        window.open(details.googleMapsURI, "_blank");
                      }
                    }}
                  >
                    Directions
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-gray-800 text-white"
                    startIcon={<OpenInNew />}
                    onClick={() => {
                      if (details?.websiteURI) {
                        window.open(details.websiteURI, "_blank");
                      }
                    }}
                  >
                    Details
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DoDisturb />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              )}
            </Stack>
          </CardContent>
        </>
      )}
    </Card>
  );
};

const ReservationPlaces: React.FC = () => {
  const placeNotes = useTripDetailStore((state) => state.placeNotes);
  const {
    placeDetails,
    addPlaceNote,
    updatePlaceNote,
    toggleEditPlaceNotes,
    deletePlaceNote,
    togglePlaceVisited,
  } = useTripDetailStore();
  const { fetchPlaceDetail } = useFetchPlaceDetails();
  const { info } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const handleAddPlace = (placeId: string) => {
    try {
      setLoading(true);
      const newPlaceNote: PlaceNote = {
        _id: `place-note-${Date.now()}`,
        placeId: placeId,
        note: "",
        visited: false,
        addedBy: info as UserInfo,
        isEditing: true,
      };

      addPlaceNote(newPlaceNote);
      fetchPlaceDetail(placeId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Accordion
        elevation={0}
        className="bg-white py-4"
        slotProps={{ transition: { unmountOnExit: true } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          className="group"
          id="panel1bh-header"
        >
          <Badge badgeContent={placeNotes.length} color="success">
            <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
              Places
            </h1>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-4">
            {/* Place search form */}

            {/* Place notes list */}
            {placeNotes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No places added yet</p>
                <p className="text-sm text-gray-400">
                  Search for places using the search box below
                </p>
              </div>
            ) : (
              placeNotes.map((placeNote) => (
                <PlaceCard
                  isLoading={loading}
                  key={placeNote._id}
                  placeNote={placeNote}
                  placeDetail={placeDetails[placeNote.placeId]}
                  onUpdateNote={updatePlaceNote}
                  onToggleEdit={toggleEditPlaceNotes}
                  onDelete={deletePlaceNote}
                  onToggleVisited={togglePlaceVisited}
                  onFetchDetails={fetchPlaceDetail}
                />
              ))
            )}
            <PlacesFinder onAddPlace={handleAddPlace} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default ReservationPlaces;
