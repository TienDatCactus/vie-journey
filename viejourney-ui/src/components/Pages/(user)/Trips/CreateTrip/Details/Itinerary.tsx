import {
  AccessTime,
  AttachMoney,
  Clear,
  DirectionsBus,
  DirectionsCar,
  DirectionsWalk,
  Edit,
  Place,
  Save,
} from "@mui/icons-material";
import {
  Autocomplete,
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
import { DateRangePicker, TimePicker } from "@mui/x-date-pickers-pro";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSocket } from "../../../../../../services/context/socketContext";
import { Itinerary } from "../../../../../../services/stores/storeInterfaces";
import { useDirectionStore } from "../../../../../../services/stores/useDirectionStore";
import { useMapPan } from "../../../../../../services/stores/useMapPan";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import {
  getDatesBetween,
  getPlacePhotoUrl,
} from "../../../../../../utils/handlers/utils";
import { useAutocompleteSuggestions } from "../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useDirections } from "../../../../../../utils/hooks/use-directions";
import { useFetchPlaceDetails } from "../../../../../../utils/hooks/use-fetch-place";
import PlaceSuggestion from "./elements/PlaceSuggestion";
interface DaySectionProps {
  date: string;
}
interface ItineraryProps {
  startDate?: Date;
  endDate?: Date;
}
interface DaySectionProps {
  date: string;
  index: number;
}
const DaySectionCard: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const { toggleEditItinerary } = useTripDetailStore();
  const [localNote, setLocalNote] = useState(itinerary.note);
  const { setSelected } = useMapPan();
  const { removePlaceId } = useDirectionStore();
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSocket();
  const [edit, setEdit] = useState<{ cost?: number; time?: string }>({
    cost: itinerary.place?.cost || undefined,
    time: itinerary.place?.time || "",
  });

  const handleUpdateItinerary = () => {
    socket?.emit("planItemUpdated", {
      section: "itineraries",
      item: {
        id: itinerary.id,
        note: localNote,
        place: {
          ...itinerary.place,
          time: edit.time,
          cost: edit.cost,
        },
      },
    });
    toggleEditItinerary(itinerary.id);
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
      <div className="relative">
        <IconButton
          className="absolute -top-4 -left-4 z-10"
          onClick={() => handleDeleteItinerary(itinerary.id)}
        >
          <Clear />
        </IconButton>
        <Card
          elevation={0}
          className="z-20 bg-neutral-50 border border-dashed border-neutral-500 w-full  rounded-xl min-h-42 max-h-fit lg:min-h-48 flex-col space-x-4 grid lg:grid-cols-6 "
        >
          <CardContent className="lg:py-4 lg:col-span-4 flex  flex-col  rounded-xl col-span-2 relative justify-between">
            <div
              className="inset-0 w-full h-full absolute"
              onClick={() => setIsOpen(!isOpen)}
            />
            {/* Notes */}
            <h1 className="text-2xl font-semibold">
              {itinerary.place?.displayName}
            </h1>
            {!itinerary.isEditing && (
              <div className="flex justify-between  items-center  w-full flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-700 flex-1 min-w-0 break-words">
                    <i className="text-neutral-700">Notes*: </i>
                    {itinerary.note || (
                      <span className="italic text-gray-400">No notes</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-800 italic">
                    by :{" "}
                    {itinerary.place?.createdBy?.fullName ||
                      itinerary.place?.createdBy?.email ||
                      "Unknown"}
                  </p>
                </div>
                <IconButton
                  className="hover:text-yellow-500"
                  size="small"
                  onClick={() => toggleEditItinerary(itinerary.id)}
                >
                  <Edit />
                </IconButton>
              </div>
            )}
            {itinerary.isEditing && (
              <div className="flex flex-col justify-between h-full text-sm">
                <TextField
                  variant="standard"
                  placeholder="Add a note"
                  fullWidth
                  multiline
                  maxRows={3}
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      className: "text-base bg-transparent",
                    },
                  }}
                  onChange={(e) => setLocalNote(e.target.value)}
                  value={localNote}
                />

                <div className="flex items-center gap-4">
                  <TimePicker
                    defaultValue={dayjs(itinerary.place?.time, "HH:mm")}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        size: "small",
                        className: "p-0 w-32",
                        InputProps: { disableUnderline: true },
                      },
                    }}
                    value={dayjs(edit.time, "HH:mm")}
                    onChange={(newValue) => {
                      setEdit((prev) => ({
                        ...prev,
                        time: newValue ? dayjs(newValue).format("HH:mm") : "",
                      }));
                    }}
                  />

                  <TextField
                    type="number"
                    variant="standard"
                    size="small"
                    placeholder="Cost"
                    className="w-24"
                    value={edit.cost}
                    onChange={(e) =>
                      setEdit((prev) => ({
                        ...prev,
                        cost: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    defaultValue={itinerary.place?.cost}
                    slotProps={{
                      htmlInput: {
                        className: "p-0",
                      },

                      input: {
                        disableUnderline: true,
                        className: "p-0",
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    className="hover:text-blue-500"
                    onClick={() => handleUpdateItinerary()}
                  >
                    <Save />
                  </IconButton>
                </div>
              </div>
            )}

            {/* Time and Cost */}
            {(itinerary.place?.time || itinerary.place?.cost) && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                  {itinerary.place?.time && (
                    <Chip
                      icon={<AccessTime className="text-sm" />}
                      label={itinerary.place?.time}
                      variant="filled"
                      size="small"
                    />
                  )}
                  {itinerary.place?.cost && (
                    <Chip
                      icon={<AttachMoney className="text-sm" />}
                      label={itinerary.place?.cost}
                      variant="filled"
                      size="small"
                    />
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {/* Place Image */}
          <div className=" lg:col-span-2 relative">
            <div className="w-full absolute lg:top-2 lg:right-2 group  items-center flex">
              <CardMedia
                component="img"
                src={
                  (itinerary.place?.photo &&
                    getPlacePhotoUrl(itinerary.place?.photo)) ||
                  "/images/place-placeholder.png"
                }
                alt={itinerary.place?.displayName || "Place image"}
                className="object-cover w-full h-40 rounded-lg cursor-pointer"
              />
              <div
                className="cursor-pointer group-hover:opacity-80  opacity-0 bg-black/30 inset-0 absolute transition-all w-full h-auto duration-200 flex items-center justify-center"
                onClick={() => {
                  if (itinerary.place) {
                    setSelected(itinerary.place);
                  }
                }}
              >
                <p className="text-white">View</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex flex-col gap-2 mt-2"
          >
            <div className="space-y-2">
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
            {itinerary.place?.editorialSummary && (
              <p className="italic text-xs text-gray-600 font-semibold line-clamp-2">
                {itinerary.place?.editorialSummary}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
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
          editorialSummary:
            placeDetails?.editorialSummary ||
            "No summary available, please refer to the location details.",
          location: {
            lat: placeDetails?.location?.lat() || 0,
            lng: placeDetails?.location?.lng() || 0,
          },
          time: "",
          cost: "",
        },
        isEditing: false,
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
    <div id={props?.index + ""} className="bg-white p-4 my-2 rounded ">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={toggleExpand}
      >
        <Typography variant="h6" className="group-hover:underline font-bold">
          {props.date}
        </Typography>
        <span className="text-sm text-gray-500">
          {placesForDay.length} places to go
        </span>
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

  const generatedDates = getDatesBetween(trip?.startDate, trip?.endDate);
  return (
    <section className="pt-10" id="itinerary">
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
            value={
              trip?.startDate && trip?.endDate
                ? [dayjs(trip.startDate), dayjs(trip.endDate)]
                : [null, null]
            }
          />
        </Stack>
        <ul className="list-none py-2 ">
          {!!generatedDates?.length &&
            generatedDates?.map((date, index) => (
              <>
                <DaySection date={date} index={index} key={index} />
                {index >= 0 && <Divider />}
              </>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default ItinerarySection;
