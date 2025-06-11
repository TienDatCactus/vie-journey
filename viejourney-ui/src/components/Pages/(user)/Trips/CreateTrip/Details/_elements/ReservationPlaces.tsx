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
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PlaceNote } from "../../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { useAutocompleteSuggestions } from "../../../../../../../utils/hooks/use-autocomplete-suggestion";
import { User } from "../../../../../../../utils/interfaces";
import { useFetchPlaceDetails } from "../../../../../../../utils/hooks/use-fetch-place";
interface PlaceDetails extends google.maps.places.PlacePrediction {}
interface PlaceCardProps {
  placeNote: PlaceNote;
  placeDetail?: google.maps.places.Place;
  onUpdateNote: (id: string, note: string) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onFetchDetails: (
    placeId: string
  ) => Promise<google.maps.places.Place | undefined>;
  currentUser: User;
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
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination);

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

      // Reset the form
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
export const PlaceCard: React.FC<PlaceCardProps> = ({
  placeNote,
  placeDetail,
  onUpdateNote,
  onToggleEdit,
  onDelete,
  onToggleVisited,
  onFetchDetails,
  currentUser,
  isLoading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [details, setDetails] = useState<google.maps.places.Place | undefined>(
    placeDetail
  );

  const open = Boolean(anchorEl);
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
    if (!placeDetail && !loading) {
      setLoading(true);
      onFetchDetails(placeNote.placeId).then(
        (fetchedDetails: google.maps.places.Place | undefined) => {
          setDetails(fetchedDetails);
          setLoading(false);
        }
      );
    } else if (placeDetail) {
      setDetails(placeDetail);
    }
  }, [placeDetail, placeNote.placeId, onFetchDetails]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote(placeNote.id, event.target.value);
  };

  return (
    <Card
      elevation={0}
      className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-64 flex-col p-2 px-4"
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
        // Regular content rendering
        <>
          <CardMedia
            component="img"
            // details?.photos && details.photos.length > 0
            // ? details.photos[0]?.getURI()
            // :
            src={"/images/ocean-beach-mountains-ud.jpg"}
            className="object-cover col-span-1 w-full h-full rounded-s-lg"
          />
          <CardContent className="p-0 px-4 lg:py-1 gap-4 flex flex-col col-span-2">
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
                    onToggleEdit(placeNote.id);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Notes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onDelete(placeNote.id);
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
              <p className="text-base text-neutral-800 text-ellipsis line-clamp-3">
                {placeNote.note || "No description provided."}
              </p>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a description..."
                variant="standard"
                size="small"
                value={placeNote.note}
                onChange={handleNoteChange}
                slotProps={{
                  input: {
                    className:
                      "text-neutral-800 text-sm border-none no-underline",
                  },
                }}
              />
            )}
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              flexWrap={"wrap"}
            >
              {!!details?.types?.length && (
                <>
                  {details.types.map((type) => (
                    <Chip
                      key={type}
                      label={type
                        .split("_")
                        .map(
                          (item) => item.charAt(0).toUpperCase() + item.slice(1)
                        )
                        .join(" ")}
                      size="small"
                      className="text-xs"
                    />
                  ))}
                </>
              )}
            </Stack>
            <Divider className="" />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                {!placeNote.isEditing ? (
                  <>
                    {" "}
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
                        checked={placeNote.visited}
                        onChange={() => onToggleVisited(placeNote.id)}
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
                  >
                    Directions
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-gray-800 text-white"
                    startIcon={<OpenInNew />}
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
                    onClick={() => onToggleEdit(placeNote.id)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    color="primary"
                    onClick={() => onToggleEdit(placeNote.id)}
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
  const CURRENT_USER: User = {
    id: "user-1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://via.placeholder.com/150",
    status: "active",
    lastLoginAt: new Date(),
    flaggedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "USER",
  };
  const {
    placeNotes,
    placeDetails,

    addPlaceNote,
    updatePlaceNote,
    toggleEditPlaceNotes,
    deletePlaceNote,
    togglePlaceVisited,
  } = useTripDetailStore();
  const { fetchPlaceDetail } = useFetchPlaceDetails();

  const handleAddPlace = (placeId: string, name: string) => {
    // Create a new place note
    const newPlaceNote: PlaceNote = {
      id: `place-note-${Date.now()}`,
      placeId: placeId,
      note: "",
      visited: false,
      addedBy: CURRENT_USER,
      isEditing: true, // Start in editing mode
    };

    addPlaceNote(newPlaceNote);
    // Start fetching the place details
    fetchPlaceDetail(placeId);
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
                  Search for places using the search box above
                </p>
              </div>
            ) : (
              placeNotes.map((placeNote) => (
                <PlaceCard
                  key={placeNote.id}
                  placeNote={placeNote}
                  placeDetail={placeDetails[placeNote.placeId]}
                  onUpdateNote={updatePlaceNote}
                  onToggleEdit={toggleEditPlaceNotes}
                  onDelete={deletePlaceNote}
                  onToggleVisited={togglePlaceVisited}
                  onFetchDetails={fetchPlaceDetail}
                  currentUser={CURRENT_USER}
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
