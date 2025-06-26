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
import { motion, useAnimation } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PlaceNote } from "../../../../../../../services/stores/storeInterfaces";
import { useAuthStore } from "../../../../../../../services/stores/useAuthStore";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { getPlacePhotoUrl } from "../../../../../../../utils/handlers/utils";
import { useAutocompleteSuggestions } from "../../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useFetchPlaceDetails } from "../../../../../../../utils/hooks/use-fetch-place";
import { UserInfo } from "../../../../../../../utils/interfaces";

interface PlaceCardProps {
  placeNote: PlaceNote;
  placeDetail?: google.maps.places.Place;
  onUpdateNote: (id: string, note: string, visited: boolean) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string, visited: boolean) => void;
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
  isLoading,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    onToggleVisited(placeNote._id, localContent.visited);
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
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/300x500?text=Image+not+available`;
            }}
            component="img"
            src={getPlacePhotoUrl(placeDetail?.photos?.[0])}
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
                <Tooltip title={placeDetail?.displayName}>
                  <h1 className="text-2xl line-clamp-2 font-semibold">
                    {placeDetail?.displayName}
                  </h1>
                </Tooltip>
                {placeDetail?.types && (
                  <Chip
                    label={placeDetail?.types[0]
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
                  {placeDetail?.regularOpeningHours?.periods[0]?.open?.hour ? (
                    <div>
                      {placeDetail?.regularOpeningHours?.periods[0]?.open?.hour}
                      AM -{" "}
                      {
                        placeDetail?.regularOpeningHours?.periods[0]?.close
                          ?.minute
                      }
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
                  {placeDetail?.priceLevel ? placeDetail.priceLevel : "NO INFO"}
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
                      if (placeDetail?.googleMapsURI) {
                        window.open(placeDetail.googleMapsURI, "_blank");
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
  const {
    addPlaceNote,
    updatePlaceNote,
    toggleEditPlaceNotes,
    deletePlaceNote,
    togglePlaceVisited,
  } = useTripDetailStore();
  const { fetchPlaceDetail, placeDetails } = useFetchPlaceDetails();
  const { info } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const handleAddPlace = async (placeId: string) => {
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
      await fetchPlaceDetail(placeId);
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
