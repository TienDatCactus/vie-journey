import {
  Add,
  AttachMoney,
  AutoFixHigh,
  CalendarMonth,
  Clear,
  Delete,
  DriveFileRenameOutline,
  Group,
  GroupAdd,
  PlaceOutlined,
  TravelExplore,
} from "@mui/icons-material";
import PublicIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
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
import { Dayjs } from "dayjs";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAutocompleteSuggestions } from "../../../../../utils/hooks/use-autocomplete-suggestion";
import { doCreateTrip } from "../../../../../services/api";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export const CreateTripForm: React.FC = () => {
  const placesLib = useMapsLibrary("places");
  if (!placesLib) {
    return <div>Loading Google Maps library...</div>;
  }
  const [modalOpen, setModalOpen] = React.useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const { suggestions, isLoading } = useAutocompleteSuggestions(destination, {
    includedPrimaryTypes: ["(regions)"],
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
    if (suggestion?.placePrediction) {
      setSelectedPlace({ placePrediction: suggestion.placePrediction });
      setDestination(suggestion.placePrediction.mainText + "");
      setDestinationId(suggestion.placePrediction.placeId || null);

      const placeInstance = new placesLib.Place({
        id: suggestion.placePrediction.placeId,
      });
      placeInstance.fetchFields({ fields: ["location"] }).then((res: any) => {
        const location = res.place?.location;
        if (!location) {
          throw new Error("No location found for placeId");
        }
        setDestinationLocation({
          lat: location.lat(),
          lng: location.lng(),
        });
      });
      setOpen(false);
    }
  };
  console.log(destinationId, destinationLocation);
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      destination: "",
      dates: [null, null] as [Dayjs | null, Dayjs | null],
      travelers: "Solo traveler",
      budget: "Budget ($0 - $500)",
      description: "",
      visibility: false, // Default visibility to false
    },
  });
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = (value: string) => {
    setModalOpen(false);
  };
  const handleModalProceed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emails = formData
      .getAll("email")
      .filter((e) => e.toString().trim() !== "")
      .map((email) => email.toString().trim());
    if (emails.length === 0) return;

    setInviteEmails((prevEmails) => [...prevEmails, ...emails]);
    setModalOpen(false);
  };
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await doCreateTrip({
        ...data,
        inviteEmails,
        destination: {
          name: data.destination,
          id: destinationId,
          location: {
            lat: destinationLocation?.lat || 0,
            lng: destinationLocation?.lng || 0,
          },
        },
        dates: data.dates.map(
          (date: Dayjs | null) => date?.toISOString() || null
        ),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200/50 z-50 text-center">
          <CircularProgress />
          <p>Creating trip ...</p>
        </div>
      )}
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
                className=""
                size="small"
                fullWidth
                placeholder="e.g Ta xua, Sapa, Da Nang"
                variant="outlined"
                {...register("destination", {
                  required: "Destination is required",
                })}
                error={!!errors.destination}
                helperText={
                  errors.destination ? errors.destination.message : ""
                }
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
              name="dates"
              control={control}
              rules={{
                required: "Travel dates are required",
                validate: (value) =>
                  value?.[0] && value?.[1]
                    ? true
                    : "Please select a date range",
              }}
              render={({ field }) => (
                <DateRangePicker
                  value={field.value as [null, null]}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      error: !!errors.dates,
                      helperText: errors.dates ? errors.dates.message : "",
                      variant: "outlined",
                      InputProps: {
                        disableUnderline: true,
                        className: "",
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
              defaultValue={"Solo traveler"}
              {...register("travelers")}
              className="w-full "
            >
              <MenuItem value={"Solo traveler"}>Solo traveler</MenuItem>
              <MenuItem value={"2 travelers"}>2 travelers</MenuItem>
              <MenuItem value={"3 travelers"}>3 travelers</MenuItem>
              <MenuItem value={"4 travelers"}>4 travelers</MenuItem>
              <MenuItem value={"5+ travelers"}>5+ travelers</MenuItem>
            </Select>
          </FormControl>
        </div>
        <FormControl className="block  my-4">
          <FormLabel className="text-sm font-semibold mb-1">
            <AttachMoney className="mr-1 mb-1" />
            Travel Budget <span>(required)</span>
          </FormLabel>
          <Select
            {...register("budget", {
              required: "Budget is required",
            })}
            defaultValue={"Budget ($0 - $500)"}
            className="w-full "
          >
            <MenuItem value={"Budget ($0 - $500)"}>Budget ($0 - $500)</MenuItem>
            <MenuItem value={"Mid-range ($500 - $1500)"}>
              Mid-range ($500 - $1500)
            </MenuItem>
            <MenuItem value={"Luxury ($1500+)"}>Luxury ($1500+)</MenuItem>
          </Select>
          <FormHelperText>
            {watch("budget").trim() == "Luxury ($1500+)".trim()
              ? `Wow you are sooo rich !`
              : ""}
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
            className="w-full "
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
          onClick={handleModalOpen}
          variant="outlined"
          className="bg-white border-dashed border-neutral-500 text-dark-800 py-2 w-full justify-start flex flex-wrap gap-2"
          startIcon={<GroupAdd />}
        >
          {inviteEmails.length > 0
            ? inviteEmails?.map((email, index) => (
                <Chip
                  key={index}
                  className="mr-2"
                  label={email}
                  deleteIcon={<Clear />}
                  onDelete={() =>
                    setInviteEmails((prev) => prev.filter((e) => e !== email))
                  }
                />
              ))
            : "Add tripmates"}
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
            className="w-full border-neutral-300 text-dark-800 py-2"
            variant="outlined"
          >
            Write a travel blog instead
          </Button>
        </div>
      </form>
      <Dialog onClose={handleModalClose} open={modalOpen}>
        <DialogTitle className="pb-0">Invite tripmates</DialogTitle>
        <form onSubmit={(e) => handleModalProceed(e)} className="p-4 pt-0">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            type="email"
            placeholder="Enter email address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupAdd />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Send Invitation
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default CreateTripForm;
