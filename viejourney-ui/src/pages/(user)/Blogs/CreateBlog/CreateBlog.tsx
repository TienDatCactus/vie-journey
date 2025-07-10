import { AddLocationAlt, Draw, Public, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../../layouts";
import { useAutocompleteSuggestions } from "../../../../utils/hooks/use-autocomplete-suggestion";
import { useUserBlog } from "../../../../services/stores/useUserBlog";
const CreateBlog: React.FC = () => {
  const { handleStartBlog } = useUserBlog();
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<string>("");
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
    // Only set selected place if placePrediction is not null
    if (suggestion?.placePrediction) {
      setSelectedPlace({ placePrediction: suggestion.placePrediction });
      setDestination(suggestion.placePrediction.mainText + "");
      setOpen(false);
    }
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      destination: "",
    },
    mode: "onChange",
  });
  return (
    <MainLayout>
      <div className="max-w-[125rem] flex flex-col items-center justify-center h-screen mx-auto">
        <div className="text-center space-y-4">
          <Chip
            label="Travel Community"
            icon={<Public className="text-blue-700" />}
            className="bg-blue-200 text-blue-700 px-2"
          />
          <h1 className="lg:text-6xl font-bold ">
            Write a{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent h-16 bg-clip-text">
              travel blog
            </span>
          </h1>
          <p className="text-lg text-gray-600 w-2/3 mx-auto">
            Help fellow travelers discover amazing places by sharing your
            experiences, tips, and unforgettable moments from your adventures.
          </p>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form submitted with data:", data);
          })}
          className="shadow-md  p-4 bg-white w-full max-w-xl mt-8"
        >
          <Stack
            direction={"row"}
            spacing={1}
            alignItems="center"
            className="mb-4"
          >
            <AddLocationAlt />
            <h1>Where did you travel?</h1>
          </Stack>
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
                variant="filled"
                fullWidth
                placeholder="e.g Ta xua, Sapa, Da Nang"
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
                  className: "p-2",
                  startAdornment: (
                    <Search color={errors.destination ? "error" : "action"} />
                  ),
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" /> : null}
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
          <div className="my-4">
            <p className="lg:text-sm text-gray-500">Popular destinations: </p>
            <Stack direction="row" spacing={1} className="" flexWrap="wrap">
              {["Paris", "New York", "Tokyo", "London", "Sydney"].map(
                (destination, index) => (
                  <Chip key={index} label={destination} />
                )
              )}
            </Stack>
          </div>
          <ButtonGroup fullWidth className="flex justify-end mt-4">
            <Button
              onClick={async () => {
                if (!destination.trim()) return;
                setLoading(true);
                const newBlogId = await handleStartBlog(destination);
                setLoading(false);
                if (newBlogId) {
                  navigate(`/blogs/edit/${newBlogId}`);
                } else {
                  console.error("Failed to create blog.");
                }
              }}
              variant="contained"
              startIcon={<Draw />}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Blog"}
            </Button>

            <Button
              onClick={() => navigate("/trips/create")}
              startIcon={<AddLocationAlt />}
            >
              Plan a trip instead
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateBlog;
