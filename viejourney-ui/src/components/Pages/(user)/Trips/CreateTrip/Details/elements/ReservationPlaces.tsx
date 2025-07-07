import {
  AccessTime,
  AttachMoney,
  BrowserNotSupported,
  Delete,
  Directions,
  DoDisturb,
  Edit,
  MoreHoriz,
  OpenInNew,
  Place,
  Save,
  Star,
  TaskAlt,
} from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
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
import { AnimatePresence, motion, useAnimation } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "../../../../../../../services/context/socketContext";
import { PlaceNote } from "../../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { getPlacePhotoUrl } from "../../../../../../../utils/handlers/utils";
import { useAutocompleteSuggestions } from "../../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useFetchPlaceDetails } from "../../../../../../../utils/hooks/use-fetch-place";

interface PlaceCardProps {
  placeNote: PlaceNote;
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
          className=""
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
            className: " py-2 border-gray-300",
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
const PlaceCard: React.FC<PlaceCardProps> = ({ placeNote, isLoading }) => {
  console.log("PlaceCard rendered for:", placeNote);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { socket } = useSocket();
  const placeDetail = placeNote.place;
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
  const { toggleEditPlaceNotes } = useTripDetailStore();
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
    socket?.emit("planItemUpdated", {
      section: "places",
      item: {
        id: placeNote.id,
        note: localContent.note,
        visited: localContent.visited,
      },
    });
    toggleEditPlaceNotes(placeNote.id);
  };

  const handleCancel = () => {
    toggleEditPlaceNotes(placeNote.id);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent((prev) => ({
      ...prev,
      note: e.target.value,
    }));
  };
  const handleDelete = () => {
    handleClose();
    socket?.emit("planItemDeleted", {
      section: "places",
      itemId: placeNote.id,
    });
  };
  return (
    <Card
      elevation={0}
      className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-64 z-20 flex-col "
    >
      {isLoading ? (
        // Loading state rendering
        <CardContent className="col-span-3 flex justify-center items-center">
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading place placeDetail...
          </Typography>
        </CardContent>
      ) : (
        <>
          <CardMedia
            loading="lazy"
            component="img"
            src={getPlacePhotoUrl(placeDetail?.photo)}
            className="object-cover col-span-1 w-full h-full rounded-s-lg"
          />
          <CardContent className="p-0 px-4 lg:py-1 flex flex-col col-span-2 justify-between z-20 space-y-4">
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Tooltip title={placeDetail?.displayName}>
                  <h1 className="text-2xl line-clamp-2 font-semibold">
                    {placeDetail?.displayName}
                  </h1>
                </Tooltip>
                {placeDetail?.types && (
                  <Chip
                    label={placeDetail?.types[0]
                      ?.split("_")
                      ?.map(
                        (item) => item.charAt(0).toUpperCase() + item.slice(1)
                      )
                      .join(" ")}
                    size="small"
                    className="bg-white border border-neutral-500 font-medium"
                  />
                )}
              </Stack>
              <IconButton onClick={handleMenuClick}>
                <MoreHoriz />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    toggleEditPlaceNotes(placeNote.id);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Notes
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Stack direction={"row"} alignItems={"baseline"}>
                <Star className="text-yellow-500 text-base " />
                <span className="text-base text-gray-600 font-semibold ml-1">
                  {placeDetail?.rating ? placeDetail.rating : "None"}
                </span>
                <span className="text-xs text-gray-600 ">
                  (
                  {placeDetail?.userRatingCount
                    ? placeDetail.userRatingCount
                    : "0"}
                  )
                </span>
              </Stack>
              <Stack direction={"row"} alignItems={"center"}>
                <AccessTime className="text-gray-600 text-base mr-0.5" />
                <span className="text-sm text-gray-600">
                  {placeDetail?.regularOpeningHours?.periods &&
                  placeDetail?.regularOpeningHours?.periods.length > 0 ? (
                    <div>
                      {placeDetail.regularOpeningHours.periods[0]?.open?.hour ||
                        "?"}
                      {placeDetail.regularOpeningHours.periods[0]?.open?.hour
                        ? "AM"
                        : ""}
                      {" - "}
                      {placeDetail.regularOpeningHours.periods[0]?.close
                        ?.hour || "?"}
                      {placeDetail.regularOpeningHours.periods[0]?.close?.hour
                        ? "PM"
                        : ""}
                    </div>
                  ) : (
                    <div>Hours not available</div>
                  )}
                </span>
              </Stack>
              <Stack direction={"row"} alignItems={"center"}>
                <AttachMoney className="text-green-600 text-base" />
                <span className="text-sm text-gray-600 font-semibold">
                  {placeDetail?.priceLevel ? placeDetail.priceLevel : "NO INFO"}
                </span>
              </Stack>
            </Stack>
            {!placeNote.isEditing ? (
              <p className="">
                <span className="text-sm font-semibold">Notes* :</span>
                <span className="text-base text-neutral-800 text-ellipsis line-clamp-3">
                  {placeNote.note || "No description provided."}
                </span>
              </p>
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
            {placeDetail?.editorialSummary && (
              <i className="text-sm text-gray-600">
                {placeDetail?.editorialSummary}
              </i>
            )}
            <div className="max-w-full overflow-hidden">
              <motion.div
                className="flex gap-2 z-10 whitespace-nowrap"
                animate={controls}
              >
                {!!placeDetail?.types?.length && (
                  <>
                    {placeDetail.types.map((type) => (
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
                      if (placeDetail?.googleMapsURI) {
                        window.open(placeDetail.googleMapsURI, "_blank");
                      }
                    }}
                  >
                    Directions
                  </Button>
                  <Button
                    variant="contained"
                    className={
                      placeDetail?.websiteURI && "bg-gray-800 text-white"
                    }
                    startIcon={<OpenInNew />}
                    disabled={!placeDetail?.websiteURI}
                    onClick={() => {
                      if (placeDetail?.websiteURI) {
                        window.open(placeDetail.websiteURI, "_blank");
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
  const [expanded, setExpanded] = useState(false);
  const { fetchPlaceDetail } = useFetchPlaceDetails();
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const handleAddPlace = async (placeId: string, name: string) => {
    try {
      setLoading(true);
      const placeDetailsFetched = await fetchPlaceDetail(placeId);
      if (!placeDetailsFetched) {
        console.error("Failed to fetch place details");
        return;
      }
      const newPlaceNote: PlaceNote = {
        id: `place-note-${Date.now()}`,
        place: {
          placeId: placeDetailsFetched.id || placeId,
          displayName: placeDetailsFetched.displayName || name,
          types: placeDetailsFetched.types || [],
          photo: placeDetailsFetched.photos
            ? getPlacePhotoUrl(placeDetailsFetched.photos[0])
            : "",
          editorialSummary:
            placeDetailsFetched.editorialSummary ||
            "No summary available, please refer to the location details.",
          regularOpeningHours: placeDetailsFetched.regularOpeningHours || {
            periods: [],
          },
          websiteURI: placeDetailsFetched.websiteURI || "",
          priceLevel: placeDetailsFetched.priceLevel || "",
          rating: placeDetailsFetched.rating || 0,
          googleMapsURI: placeDetailsFetched.googleMapsURI || "",
          userRatingCount: placeDetailsFetched.userRatingCount || 0,
        },
        note: "",
        visited: false,
        isEditing: false,
        createdAt: new Date().toISOString(),
      };
      socket?.emit("planItemAdded", {
        section: "places",
        item: newPlaceNote,
      });
    } catch (error) {
      console.error("Error adding place:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-4 rounded" id="places">
      <div
        className="flex items-center justify-between px-4 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Badge badgeContent={placeNotes.length} color="success">
          <h1 className="text-3xl font-bold text-neutral-900 hover:underline">
            Places
          </h1>
        </Badge>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 pt-4"
          >
            <div className="flex flex-col gap-4">
              {/* Place search form */}

              {/* Place notes list */}
              {placeNotes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50  border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No places added yet</p>
                  <p className="text-sm text-gray-400">
                    Search for places using the search box below
                  </p>
                </div>
              ) : (
                placeNotes.map((placeNote) => (
                  <PlaceCard
                    isLoading={loading}
                    key={placeNote.id}
                    placeNote={placeNote}
                  />
                ))
              )}
              <PlacesFinder onAddPlace={handleAddPlace} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ReservationPlaces;
