import {
  AccessTime,
  AttachMoney,
  DirectionsBus,
  DirectionsCar,
  DirectionsWalk,
  Edit,
  Place,
  Settings,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DateRangePicker,
  MobileTimeRangePicker,
} from "@mui/x-date-pickers-pro";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Itinerary } from "../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import {
  getDatesBetween,
  getPlacePhotoUrl,
} from "../../../../../../utils/handlers/utils";
import { useAutocompleteSuggestions } from "../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useDirections } from "../../../../../../utils/hooks/use-directions";
import { useFetchPlaceDetails } from "../../../../../../utils/hooks/use-fetch-place";
import { useMapPan } from "../../../../../../services/stores/useMapPan";
import { useDirectionStore } from "../../../../../../services/stores/useDirectionStore";
import PlaceSuggestion from "./elements/PlaceSuggestion";
import { useSocket } from "../../../../../../services/context/socketContext";
interface DaySectionProps {
  date: string;
}
interface ItineraryProps {
  startDate?: Date;
  endDate?: Date;
}
interface DaySectionProps {
  date: string;
}
const DaySectionCard: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const { toggleEditItinerary } = useTripDetailStore();
  const [localNote, setLocalNote] = useState(itinerary.note);
  const { setSelected } = useMapPan();
  const { removePlaceId } = useDirectionStore();
  const { socket } = useSocket();
  const [edit, setEdit] = useState({
    cost: {
      isEditing: false,
      value: itinerary.cost || "",
    },
    time: {
      isEditing: false,
      value: {
        startTime: itinerary.time.startTime || "",
        endTime: itinerary.time.endTime || "",
      },
    },
  });
  const handleUpdateItinerary = () => {
    socket?.emit("planItemUpdated", {
      section: "itineraries",
      item: {
        id: itinerary.id,
        note: localNote,
        time: {
          startTime: edit.time.value.startTime,
          endTime: edit.time.value.endTime,
        },
      },
    });
  };

  const handleDeleteItinerary = (id: string) => {
    socket?.emit("planItemDeleted", {
      section: "itineraries",
      itemId: id,
    });
    removePlaceId(itinerary.place?.placeId || "");
  };
  return (
    <>
      <Card
        elevation={0}
        className="w-full z-20 grid lg:grid-cols-3 rounded-xl min-h-48 max-h-fit lg:min-h-52 flex-col space-x-4 relative "
      >
        <CardContent className="lg:py-4 justify-between flex min-h-48 max-h-fit lg:min-h-56 flex-col bg-neutral-200 rounded-xl col-span-2 ">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              {itinerary.place?.displayName}
            </h1>
            {itinerary.place?.types && (
              <Stack
                direction="row"
                alignItems="center"
                flexWrap={"wrap"}
                className="text-xs space-x-2 text-gray-600 font-medium line-clamp-1"
              >
                {itinerary.place?.types
                  .filter((e) => e != "point_of_interest")
                  .map((type, index) => (
                    <Chip key={index} label={type} className="p-0" />
                  ))}
              </Stack>
            )}
          </div>

          {/* Notes */}
          {!itinerary.isEditing && (
            <div className="flex justify-between  items-center my-2 w-full flex-wrap gap-2">
              <p className="text-sm text-gray-700 flex-1 min-w-0 break-words">
                <i className="text-neutral-700">Notes*: </i>
                {itinerary.note || (
                  <span className="italic text-gray-400">No notes</span>
                )}
              </p>
              <IconButton onClick={() => toggleEditItinerary(itinerary.id)}>
                <Edit />
              </IconButton>
            </div>
          )}

          {itinerary.place?.editorialSummary && (
            <p className="italic text-xs text-gray-600 font-semibold">
              {itinerary.place?.editorialSummary}
            </p>
          )}

          {/* Time and Cost */}
          {(itinerary.time.startTime || itinerary.cost) &&
            !itinerary.isEditing && (
              <div className="flex flex-col gap-2 mt-2">
                {/* Display current time and cost if they exist */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                  {itinerary.time.startTime && (
                    <Chip
                      icon={<AccessTime className="text-sm" />}
                      label={`${itinerary.time.startTime}${
                        itinerary.time.endTime
                          ? ` - ${itinerary.time.endTime}`
                          : ""
                      }`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {itinerary.cost && (
                    <Chip
                      icon={<AttachMoney className="text-sm" />}
                      label={itinerary.cost}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </div>
              </div>
            )}
        </CardContent>

        {/* Place Image */}
        <div className="relative col-span-1 w-full h-full rounded-lg group items-center flex">
          <CardMedia
            component="img"
            src={
              (itinerary.place?.photo &&
                getPlacePhotoUrl(itinerary.place?.photo)) ||
              "/images/place-placeholder.png"
            }
            alt={itinerary.place?.displayName || "Place image"}
            className="object-cover  w-full h-full max-h-56 rounded-lg cursor-pointer"
          />
          <div
            className="cursor-pointer group-hover:opacity-80 rounded-lg opacity-0 bg-black/30 inset-0 absolute transition-all duration-200 flex items-center justify-center"
            onClick={() => {
              if (itinerary.place) {
                setSelected(itinerary.place);
              }
            }}
          >
            <p className="text-white">View</p>
          </div>
        </div>
      </Card>
      {itinerary.isEditing && (
        <>
          <TextField
            variant="filled"
            placeholder="Add a note"
            multiline
            fullWidth
            slotProps={{
              input: {
                className: " py-4",
              },
            }}
            onChange={(e) => {
              setLocalNote(e.target.value);
            }}
            value={localNote}
          />
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <MobileTimeRangePicker
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "small",
                    className: "w-48",
                  },
                }}
                className="my-2"
                value={[
                  dayjs(edit.time.value.startTime, "HH:mm"),
                  dayjs(edit.time.value.endTime, "HH:mm"),
                ]}
                onChange={(newValue) => {
                  setEdit((prev) => ({
                    ...prev,
                    time: {
                      ...prev.time,
                      value: {
                        startTime:
                          (newValue && newValue[0]?.format("HH:mm")) || "",
                        endTime:
                          (newValue && newValue[1]?.format("HH:mm")) || "",
                      },
                    },
                  }));
                }}
              />
              <TextField
                type="number"
                variant="standard"
                placeholder="Add cost"
                size="small"
                className="w-48 my-2"
                value={edit.cost.value}
                onChange={(e) =>
                  setEdit((prev) => ({
                    ...prev,
                    cost: {
                      ...prev.cost,
                      value: e.target.value,
                    },
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <ButtonGroup>
              <Button
                color="primary"
                variant="text"
                className="h-fit"
                onClick={handleUpdateItinerary}
              >
                Save
              </Button>
              <Button
                color="error"
                variant="text"
                className="h-fit"
                onClick={() => handleDeleteItinerary(itinerary.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Stack>
        </>
      )}
    </>
  );
};

const DistanceDivider = ({
  originPlaceId,
  destinationPlaceId,
}: {
  originPlaceId: string;
  destinationPlaceId: string;
}) => {
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    google.maps.TravelMode.DRIVING
  );

  const { result, isLoading, error } = useDirections(
    originPlaceId,
    destinationPlaceId,
    travelMode
  );
  const { setTravelMode: addTravelMode } = useDirectionStore();

  useEffect(() => {
    if (addTravelMode) {
      addTravelMode(travelMode);
    }
  }, [originPlaceId, destinationPlaceId, travelMode]);

  const handleTravelModeChange = (event: any) => {
    const mode = event.target.value as google.maps.TravelMode;
    setTravelMode(mode);
  };

  return (
    <div className="lg:min-h-14 relative">
      <div className="border-r-2 border-dashed border-gray-300 h-full absolute left-[1.75rem] top-0 bottom-0 z-0 transform -translate-x-1/2"></div>
      <Stack className="absolute lg:left-1/12 lg:min-w-30 lg:top-0 lg:bottom-0 z-10 flex justify-center">
        <Select
          value={travelMode}
          onChange={handleTravelModeChange}
          variant="standard"
          disableUnderline
          className="text-neutral-800 text-sm"
        >
          <MenuItem value={google.maps.TravelMode.DRIVING}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              className="*:text-sm *:text-neutral-800"
            >
              <DirectionsCar />
              Car
            </Stack>
          </MenuItem>
          <MenuItem value={google.maps.TravelMode.WALKING}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              className="*:text-sm *:text-neutral-800"
            >
              <DirectionsWalk />
              Walk
            </Stack>
          </MenuItem>
          <MenuItem value={google.maps.TravelMode.TRANSIT}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              className="*:text-sm *:text-neutral-800"
            >
              <DirectionsBus />
              Bus
            </Stack>
          </MenuItem>
        </Select>

        {isLoading ? (
          <CircularProgress size={20} />
        ) : error ? (
          <p className="text-sm text-red-500">Error calculating route</p>
        ) : result ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <p className="text-sm">{result.duration}</p>
            <div className="w-2 h-2 rounded-full bg-gray-400 border border-white z-20 transform"></div>
            <p className="text-sm">{result.distance}</p>
            <Link
              to={result.url}
              className="text-sm text-neutral-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Direction
            </Link>
          </Stack>
        ) : (
          <p className="text-sm">Calculating...</p>
        )}
      </Stack>
    </div>
  );
};

const DaySectionPlaceFinder = ({
  onAddPlace,
}: {
  onAddPlace: (placeId: string) => void;
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
      if (placeId) {
        onAddPlace(placeId);
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

const DaySection: React.FC<DaySectionProps> = (props) => {
  const { itineraries } = useTripDetailStore();
  const { fetchPlaceDetail } = useFetchPlaceDetails();
  const placesForDay = itineraries.filter((item) => item.date === props.date);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { socket } = useSocket();
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleAddPlace = async (placeId: string) => {
    try {
      setLoading(true);
      const placeDetails = await fetchPlaceDetail(placeId);
      const itinerary = {
        id: `itinerary-note-${Date.now()}`,
        note: "",
        date: props.date,
        place: {
          placeId: placeDetails?.id || "",
          displayName: placeDetails?.displayName || "",
          types: placeDetails?.types || [],
          photo: placeDetails?.photos
            ? getPlacePhotoUrl(placeDetails?.photos[0])
            : "",
          editorialSummary: placeDetails?.editorialSummary || "",
          location: {
            lat: placeDetails?.location?.lat() || 0,
            lng: placeDetails?.location?.lng() || 0,
          },
        },
        time: {
          startTime: "",
          endTime: "",
        },
        isEditing: true,
      };
      socket?.emit("planItemAdded", {
        section: "itineraries",
        item: itinerary,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 my-2 rounded flex items-center justify-center">
        <CircularProgress color="inherit" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 my-2 rounded ">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={toggleExpand}
      >
        <Typography variant="h6" className="group-hover:underline font-bold">
          {props.date}
        </Typography>
        <IconButton>
          <Settings />
        </IconButton>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-4 space-y-4">
              {placesForDay.map((itinerary, index) => (
                <React.Fragment key={itinerary.id}>
                  {index > 0 && (
                    <DistanceDivider
                      originPlaceId={
                        placesForDay[index - 1].place?.placeId || ""
                      }
                      destinationPlaceId={itinerary.place?.placeId || ""}
                    />
                  )}
                  <DaySectionCard itinerary={itinerary} />
                </React.Fragment>
              ))}
              <DaySectionPlaceFinder onAddPlace={handleAddPlace} />
              {placesForDay.length > 0 && (
                <PlaceSuggestion
                  place={placesForDay[placesForDay.length - 1].place!}
                  onAddPlace={handleAddPlace}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ItinerarySection: React.FC<ItineraryProps> = () => {
  const trip = useTripDetailStore((state) => state.trip);
  const generatedDates = getDatesBetween(trip.startDate, trip.endDate);
  return (
    <section className="pt-10">
      <div className="bg-white lg:p-10 lg:px-12">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <h1 className="text-3xl font-bold">Itinerary</h1>
          <DateRangePicker
            slotProps={{
              textField: {
                variant: "standard",
                InputProps: {
                  disableUnderline: true, // Remove the underline for standard variant
                  sx: {
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    padding: "8px",
                    backgroundColor: "transparent",
                    "& .MuiInputBase-input": {
                      padding: "4px 8px",
                    },
                    boxShadow: "none",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  },
                },
              },
            }}
            defaultValue={[dayjs(trip.startDate), dayjs(trip.endDate)]}
          />
        </Stack>
        <ul className="list-none py-2 ">
          {!!generatedDates?.length &&
            generatedDates?.map((date, index) => (
              <>
                <DaySection date={date} key={index} />
                {index >= 0 && <Divider />}
              </>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default ItinerarySection;
