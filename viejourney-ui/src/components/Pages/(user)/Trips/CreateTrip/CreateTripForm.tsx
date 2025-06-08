import {
  Add,
  AttachMoney,
  AutoFixHigh,
  CalendarMonth,
  DriveFileRenameOutline,
  Group,
  GroupAdd,
  PlaceOutlined,
} from "@mui/icons-material";
import PublicIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import usePlaces from "../../../../../utils/hooks/usePlaces";

// Define a type for the place suggestion
interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export const CreateTripForm: React.FC = () => {
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const { suggestions, isLoading, getSuggestions } = usePlaces();

  const filterOptions = {
    types: ["(regions)"], // This filters for administrative areas
  };

  // Handle input change for destination
  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setDestination(value);

    if (value.length >= 2) {
      getSuggestions(value, filterOptions);
    }
  };

  const handlePlaceSelect = (place: PlaceSuggestion | null) => {
    setSelectedPlace(place);
    if (place) {
      setDestination(place.mainText);
    }
  };

  const { control } = useForm({
    defaultValues: {
      destination: "",
      startDate: null,
      endDate: null,
    },
  });
  return (
    <Form
      control={control}
      className="w-full lg:col-span-4 gap-4 shadow-sm border border-neutral-400 rounded-2xl bg-white p-4"
    >
      <Stack direction={"row"} gap={1} marginBottom={2} alignItems={"center"}>
        <PlaceOutlined className="" />
        <h1 className="text-2xl font-bold">Create a new Trip</h1>
      </Stack>
      <FormControl className="w-full">
        <FormLabel className="text-sm font-semibold mb-1">
          Trip Title <span>(required)</span>
        </FormLabel>
        <Autocomplete
          id="destination-autocomplete"
          open={open}
          onOpen={() => {
            if (destination.length >= 2) setOpen(true);
          }}
          onClose={() => setOpen(false)}
          isOptionEqualToValue={(option, value) =>
            option.placeId === value.placeId
          }
          getOptionLabel={(option) => option.mainText}
          options={suggestions}
          loading={isLoading}
          value={selectedPlace}
          onChange={(event, newValue) => handlePlaceSelect(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              className="rounded-lg"
              size="small"
              fullWidth
              placeholder="e.g Ta xua, Sapa, Da Nang"
              variant="outlined"
              value={destination}
              onChange={handleDestinationChange}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
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
            <li {...props} key={option.placeId}>
              <Stack>
                <div className="font-medium">{option.mainText}</div>
                <div className="text-sm text-gray-500">
                  {option.secondaryText}
                </div>
              </Stack>
            </li>
          )}
        />
      </FormControl>
      <div className="grid grid-cols-1 my-4 lg:grid-cols-2 gap-4">
        <FormControl>
          <FormLabel className="text-sm font-semibold mb-1">
            <CalendarMonth className="mr-1" />
            Travel dates
          </FormLabel>
          <DateRangePicker
            defaultValue={[null, null]}
            slotProps={{
              textField: {
                variant: "outlined",
                InputProps: {
                  disableUnderline: true,
                  className: "rounded-lg", // Remove the underline for standard variant
                },
              },
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel className="text-sm font-semibold mb-1">
            <Group className="mr-1" />
            Number of travelers
          </FormLabel>
          <Select defaultValue={1} className="w-full rounded-lg">
            <MenuItem value={1}>1 travelers</MenuItem>
            <MenuItem value={2}>2 travelers</MenuItem>
            <MenuItem value={3}>3 travelers</MenuItem>
            <MenuItem value={4}>4 travelers</MenuItem>
            <MenuItem value={"more"}>5+ travelers</MenuItem>
          </Select>
        </FormControl>
      </div>
      <FormControl className="block  my-4">
        <FormLabel className="text-sm font-semibold mb-1">
          <AttachMoney className="mr-1 mb-1" />
          Budget per person (optional)
        </FormLabel>
        <Select defaultValue={1} className="w-full rounded-lg">
          <MenuItem value={1}>Budget ($0 - $500)</MenuItem>
          <MenuItem value={2}>Mid-range ($500 - $1500)</MenuItem>
          <MenuItem value={3}>Luxury ($1500+)</MenuItem>
        </Select>
      </FormControl>

      <FormControl className="block my-4">
        <FormLabel className="text-sm font-semibold mb-1">
          <Add className="mr-1 mb-1" />
          Tell us more about your trip (optional)
        </FormLabel>
        <TextField
          multiline
          rows={3}
          placeholder="Describe your trip, activities, and preferences"
          variant="outlined"
          className="w-full rounded-lg"
        />
      </FormControl>
      <Divider className="my-4" />
      <FormControl className="my-4 block items-center justify-between">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
          className="mb-2"
        >
          <FormLabel className=" mb-1">
            <Stack
              direction="row"
              alignItems="center"
              className="font-semibold"
            >
              <PublicIcon className="mr-1" />
              Trip Visibility
            </Stack>
            <p className="text-sm text-gray-500">Anyone can view this trip</p>
          </FormLabel>
          <Switch />
        </Stack>
      </FormControl>
      <Button
        variant="outlined"
        className="bg-white border-dashed border-neutral-500 text-dark-800 py-2 w-full justify-start"
        startIcon={<GroupAdd />}
      >
        Invite tripmates
      </Button>
      <div className="my-6">
        <Button
          startIcon={<AutoFixHigh />}
          variant="contained"
          className="bg-dark-800 w-full"
        >
          Start planning your trip
        </Button>
        <Divider className="uppercase text-neutral-700 text-sm my-2">
          or
        </Divider>
        <Button
          startIcon={<DriveFileRenameOutline />}
          className="w-full border-neutral-300 text-dark-800 py-2 "
          variant="outlined"
        >
          Write a travel blog instead
        </Button>
      </div>
    </Form>
  );
};

export default CreateTripForm;
