import {
  AccessTime,
  AttachMoney,
  DirectionsBus,
  DirectionsCar,
  DirectionsWalk,
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
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import { useAutocompleteSuggestions } from "../../../../../../utils/hooks/use-autocomplete-suggestion";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useForm } from "react-hook-form";
interface DaySectionProps {
  date: string;
}
interface ItineraryProps {
  startDate?: Date;
  endDate?: Date;
}

function getDatesBetween(startDate: Date, endDate: Date): string[] {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dates: string[] = [];

  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    dates.push(current.format("dddd, Do MMMM")); // → Wednesday, 11th June
    current = current.add(1, "day");
  }

  return dates;
}

const DaySectionCard: React.FC = () => {
  return (
    <Card
      elevation={0}
      className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-42 flex-col space-x-4 relative"
    >
      <CardContent className=" lg:py-4 gap-4 flex flex-col bg-neutral-200 rounded-xl col-span-2">
        <h1 className="text-2xl font-semibold">Assam</h1>
        {/* <p>
A beautiful state in northeastern India known for its tea
plantations and wildlife.
</p> */}
        <TextField variant="standard" placeholder="Add a note" multiline />
        <p className="italic text-xs text-gray-600 font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti,
          velit quibusdam corporis doloremque, ea voluptates quaerat ipsam odio
          exercitationem eligendi facilis voluptatem asperiores dolor officia
          eaque beatae eius deleniti odit!
        </p>
        <Stack
          direction="row"
          className=" *:py-0 *:text-dark-700 *:hover:text-dark-950 *:hover:bg-neutral-100 "
          spacing={1}
        >
          <Button startIcon={<AccessTime className="text-xl" />} variant="text">
            Add time
          </Button>
          <Button
            startIcon={<AttachMoney className="text-xl" />}
            variant="text"
          >
            Add cost
          </Button>
        </Stack>
      </CardContent>
      <CardMedia
        component="img"
        src="/images/ocean-beach-mountains-ud.jpg"
        className="object-cover col-span-1 w-full h-full rounded-lg"
      />
    </Card>
  );
};

const DistanceDivider = () => {
  return (
    <div className="lg:min-h-14 relative ">
      <div className="border-r-2 border-dashed border-gray-300 h-full absolute left-[1.75rem] top-0 bottom-0 z-0 transform -translate-x-1/2"></div>
      <Stack className="absolute lg:left-1/12 lg:min-w-30 lg:top-0 lg:bottom-0 z-10 flex justify-center">
        <Select
          id="demo-simple-select"
          defaultValue={"car"}
          variant="standard"
          disableUnderline
          className="text-neutral-800 text-sm"
          inputProps={{}}
        >
          <MenuItem value={"car"}>
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
          <MenuItem value={"walk"}>
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
          <MenuItem value={"bus"}>
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
        <Stack direction="row" alignItems="center" gap={1}>
          <p className="text-sm">1 hr 9 mins</p>
          <div className=" w-2 h-2 rounded-full bg-gray-400 border border-white z-20 transform"></div>
          <p className="text-sm">97km</p>
          <Link to="#" className="text-sm text-neutral-900">
            Direction
          </Link>
        </Stack>
      </Stack>
    </div>
  );
};

const DaySectionPlaceFinder = ({
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
const DaySection: React.FC<DaySectionProps> = (props) => {
  return (
    <Accordion
      elevation={0}
      className="bg-white py-4 my-4"
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
      <AccordionDetails className="p-0">
        <DaySectionCard />
        <DistanceDivider />
        <DaySectionCard />
        <DaySectionPlaceFinder
          onAddPlace={(placeId, name) => {
            console.log("Place added:", placeId, name);
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};
const Itinerary: React.FC<ItineraryProps> = () => {
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
        <ul className="list-none py-4">
          {!!generatedDates?.length &&
            generatedDates?.map((date, index) => (
              <DaySection date={date} key={index} />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Itinerary;
