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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
} from "@mui/x-date-pickers-pro";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
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
interface DaySectionProps {
  date: string;
}
interface ItineraryProps {
  startDate?: Date;
  endDate?: Date;
}

const DaySectionCard: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const { updateItinerary, toggleEditItinerary, deleteItinerary } =
    useTripDetailStore();
  const [localNote, setLocalNote] = useState(itinerary.note);
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
  const handleUpdateItinerary = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(localNote);
      updateItinerary(itinerary._id, { note: localNote });
      console.log(itinerary);
      toggleEditItinerary(itinerary._id);
    }
  };
  const handleCostUpdate = () => {
    updateItinerary(itinerary._id, { cost: edit.cost.value });
    setEdit((prev) => ({
      ...prev,
      cost: { ...prev.cost, isEditing: false },
    }));
  };

  // Handle time update
  const handleTimeUpdate = () => {
    updateItinerary(itinerary._id, {
      time: {
        startTime: edit.time.value.startTime,
        endTime: edit.time.value.endTime,
      },
    });
    setEdit((prev) => ({
      ...prev,
      time: { ...prev.time, isEditing: false },
    }));
  };

  return (
    <Card
      elevation={0}
      className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-42 flex-col space-x-4 relative"
    >
      <CardContent className="lg:py-4 justify-between gap-2 flex flex-col bg-neutral-200 rounded-xl col-span-2">
        <h1 className="text-2xl font-semibold">
          {itinerary.place?.displayName}
        </h1>

        {/* Types */}
        {itinerary.place?.types && (
          <Stack
            direction="row"
            alignItems="center"
            flexWrap={"wrap"}
            gap={1}
            className="text-sm text-gray-600 font-semibold"
          >
            {itinerary.place?.types
              .filter((e) => e != "point_of_interest")
              .map((type, index) => (
                <Chip key={index} label={type} />
              ))}
          </Stack>
        )}

        {/* Notes */}
        {itinerary.isEditing ? (
          <TextField
            variant="standard"
            placeholder="Add a note"
            multiline
            onChange={(e) => {
              setLocalNote(e.target.value);
            }}
            className="my-2"
            value={localNote}
            onKeyDownCapture={(e) => handleUpdateItinerary(e)}
          />
        ) : (
          <div className="flex items-center justify-between">
            <p className="my-2">{itinerary.note}</p>
            <IconButton onClick={() => toggleEditItinerary(itinerary._id)}>
              <Edit />
            </IconButton>
          </div>
        )}

        <p className="italic text-xs text-gray-600 font-semibold">
          {itinerary.place?.editorialSummary}
        </p>

        {/* Time and Cost */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Display current time and cost if they exist */}
          {(itinerary.time.startTime || itinerary.cost) && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {itinerary.time.startTime && (
                <Chip
                  icon={<AccessTime className="text-sm" />}
                  label={`${dayjs(itinerary.time.startTime).format("HH:mm")}${
                    itinerary.time.endTime
                      ? ` - ${dayjs(itinerary.time.endTime).format("HH:mm")}`
                      : ""
                  }`}
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setEdit((prev) => ({
                      ...prev,
                      time: { ...prev.time, isEditing: true },
                    }))
                  }
                />
              )}
              {itinerary.cost && (
                <Chip
                  icon={<AttachMoney className="text-sm" />}
                  label={itinerary.cost}
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setEdit((prev) => ({
                      ...prev,
                      cost: { ...prev.cost, isEditing: true },
                    }))
                  }
                />
              )}
            </div>
          )}
        </div>

        <Stack
          direction="row"
          flexWrap={"wrap"}
          className="*:not-last::py-0 *:not-last:text-dark-700 *:not-last:hover:text-dark-950 *:not-last:hover:bg-neutral-100"
          spacing={1}
        >
          {/* Time Editor */}
          {edit.time.isEditing ? (
            <div className="flex items-center gap-2">
              <TimeRangePicker
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "small",
                    className: "w-48",
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
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
              <Button variant="text" size="small" onClick={handleTimeUpdate}>
                Save
              </Button>
            </div>
          ) : (
            <Button
              startIcon={<AccessTime className="text-xl" />}
              variant="text"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  time: {
                    isEditing: true,
                    value: {
                      startTime: itinerary.time.startTime || "",
                      endTime: itinerary.time.endTime || "",
                    },
                  },
                }))
              }
            >
              {itinerary.time.startTime ? "Edit time" : "Add time"}
            </Button>
          )}

          {/* Cost Editor */}
          {edit.cost.isEditing ? (
            <div className="flex items-center gap-2">
              <TextField
                variant="standard"
                placeholder="Add cost"
                size="small"
                className="w-32"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCostUpdate();
                  }
                }}
              />
              <Button variant="text" size="small" onClick={handleCostUpdate}>
                Save
              </Button>
            </div>
          ) : (
            <Button
              startIcon={<AttachMoney className="text-xl" />}
              variant="text"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  cost: {
                    isEditing: true,
                    value: itinerary.cost || "",
                  },
                }))
              }
            >
              {itinerary.cost ? "Edit cost" : "Add cost"}
            </Button>
          )}

          {/* Delete Button */}
          <Button
            color="error"
            variant="text"
            className="del-btn"
            onClick={() => deleteItinerary(itinerary._id)}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>

      {/* Place Image */}
      <CardMedia
        component="img"
        onError={(e) => {
          e.currentTarget.src = "/images/place-placeholder.png";
        }}
        src={
          (itinerary.place?.photos &&
            getPlacePhotoUrl(itinerary.place?.photos?.[0])) ||
          ""
        }
        alt={itinerary.place?.displayName || "Place image"}
        className="object-cover col-span-1 w-full h-full rounded-lg"
      />
    </Card>
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

  const handleTravelModeChange = (event: any) => {
    setTravelMode(event.target.value);
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
  const { addItinerary, itineraries } = useTripDetailStore();
  const { fetchPlaceDetail } = useFetchPlaceDetails();
  const placesForDay = itineraries.filter((item) => item.date === props.date);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpandChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
  };
  const handleAddPlace = async (placeId: string) => {
    try {
      setLoading(true);
      const placeDetails = await fetchPlaceDetail(placeId).then((data) => {
        return data;
      });
      const itinerary = {
        _id: `place-note-${Date.now()}`,
        placeId: placeId,
        note: "",
        date: props.date,
        place: placeDetails,
        time: {
          startTime: "",
          endTime: "",
        },
        isEditing: true,
      };
      addItinerary(itinerary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <CircularProgress color="inherit" size={40} />;
  }
  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpandChange}
      className="bg-white p-4 my-4 rounded-lg shadow-sm"
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary
        expandIcon={<Settings />}
        aria-controls="panel1bh-content"
        className="group p-0"
        id="panel1bh-header"
      >
        <h1 className="text-2xl font-bold group-hover:underline">
          {props.date}
        </h1>
      </AccordionSummary>
      <AccordionDetails className="p-0 space-y-4">
        {placesForDay.map((itinerary, index) => (
          <React.Fragment key={itinerary._id}>
            {index > 0 && (
              <DistanceDivider
                originPlaceId={placesForDay[index - 1].placeId || ""}
                destinationPlaceId={itinerary.placeId || ""}
              />
            )}
            <DaySectionCard itinerary={itinerary} />
          </React.Fragment>
        ))}
        <DaySectionPlaceFinder onAddPlace={handleAddPlace} />
        {/* <DaySectionCard /> */}
      </AccordionDetails>
    </Accordion>
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
        <ul className="list-none py-4 ">
          {!!generatedDates?.length &&
            generatedDates?.map((date, index) => (
              <DaySection date={date} key={index} />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default ItinerarySection;
