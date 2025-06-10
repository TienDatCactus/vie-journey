import {
  Add,
  AttachMoney,
  AutoFixHigh,
  CalendarMonth,
  DriveFileRenameOutline,
  Group,
  GroupAdd,
  PlaceOutlined,
  TravelExplore,
} from "@mui/icons-material";
import PublicIcon from "@mui/icons-material/Public";
import { NumericFormat } from "react-number-format";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAutocompleteSuggestions } from "../../../../../utils/hooks/use-autocomplete-suggestion";
import { Dayjs } from "dayjs";

export const CreateTripForm: React.FC = () => {
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [open, setOpen] = useState(false); // Use the hook with proper debouncing configuration
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination, {
    includedPrimaryTypes: ["(regions)"],
  });
  // Handle input change for destination with proper debouncing
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
    // Only set selected place if placePrediction is not null
    if (suggestion?.placePrediction) {
      setSelectedPlace({ placePrediction: suggestion.placePrediction });
      setDestination(suggestion.placePrediction.mainText + "");
      setOpen(false);
    }
  };
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      destination: "",
      travelDates: [null, null] as [Dayjs | null, Dayjs | null],
      travelers: 1,
      budget: 1,
      description: "",
      visibility: true, // Default visibility to true
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:col-span-4 gap-4 shadow-sm border border-neutral-400 rounded-2xl bg-white p-4"
    >
      <Stack direction={"row"} gap={1} marginBottom={2} alignItems={"center"}>
        <PlaceOutlined className="" />
        <h1 className="text-2xl font-bold">Create a new Trip</h1>
      </Stack>
      <FormControl
        className="w-full"
        color={errors.destination ? "error" : "primary"}
      >
        <FormLabel className="text-sm font-semibold mb-1">
          <TravelExplore className="mr-1" />
          Trip Destination <span>(required)</span>
        </FormLabel>{" "}
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
              placeholder="e.g Ta xua, Sapa, Da Nang"
              variant="outlined"
              {...register("destination", {
                required: "Destination is required",
              })}
              error={!!errors.destination}
              helperText={errors.destination ? errors.destination.message : ""}
              onChange={handleInputChange}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      color={errors.destination ? "error" : "action"}
                    />
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
      </FormControl>
      <div className="grid grid-cols-1 my-4 lg:grid-cols-2 gap-4">
        <FormControl>
          <FormLabel className="text-sm font-semibold mb-1">
            <CalendarMonth className="mr-1" />
            Travel dates
          </FormLabel>
          <Controller
            name="travelDates"
            control={control}
            rules={{
              required: "Travel dates are required",
              validate: (value) =>
                value?.[0] && value?.[1] ? true : "Please select a date range",
            }}
            render={({ field }) => (
              <DateRangePicker
                value={field.value as [null, null]}
                onChange={(newValue) => field.onChange(newValue)}
                slotProps={{
                  textField: {
                    error: !!errors.travelDates,
                    helperText: errors.travelDates
                      ? errors.travelDates.message
                      : "",
                    variant: "outlined",
                    InputProps: {
                      disableUnderline: true,
                      className: "rounded-lg",
                    },
                  },
                }}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel className="text-sm font-semibold mb-1">
            <Group className="mr-1" />
            Number of travelers
          </FormLabel>
          <Select
            defaultValue={1}
            {...register("travelers")}
            className="w-full rounded-lg"
          >
            <MenuItem value={0}>Solo traveler</MenuItem>
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
          Budget per person
        </FormLabel>
        <Controller
          name="budget"
          control={control}
          rules={{
            required: "Budget is required",
            validate: (value) =>
              value > 0 ? true : "Budget must be greater than 0",
          }}
          render={({ field }) => (
            <NumericFormat
              {...field}
              className="w-full rounded-lg"
              placeholder="Enter your budget"
              variant="outlined"
              value={field.value}
              onValueChange={(values) => {
                const { floatValue } = values;
                field.onChange(floatValue);
              }}
              customInput={TextField}
              error={!!errors.budget}
              helperText={errors.budget ? errors.budget.message : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          )}
        />
        <FormHelperText>
          {watch("budget") > 100000 ? `Wow you are sooo rich !` : ""}
        </FormHelperText>
      </FormControl>

      <FormControl className="block my-4">
        <FormLabel className="text-sm font-semibold mb-1">
          <Add className="mr-1 mb-1" />
          Tell us more about your trip (optional)
        </FormLabel>
        <TextField
          multiline
          rows={3}
          {...register("description")}
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
          <Switch {...register("visibility")} checked={watch("visibility")} />
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
          type="submit"
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
    </form>
  );
};

export default CreateTripForm;
