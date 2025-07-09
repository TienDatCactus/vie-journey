import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Rating,
  Chip,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "../../../utils/hooks/use-autocomplete-suggestion";
import { useFetchPlaceDetails } from "../../../utils/hooks/use-fetch-place";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string; // Keep as string for display, will convert to object when sending to API
  image: string[]; // Changed from 'image' to 'images' to match backend
}

interface AddHotelDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (hotelData: Partial<Hotel>) => void;
  loading?: boolean;
}

const AddHotelDialog: React.FC<AddHotelDialogProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
}) => {
  const placesLib = useMapsLibrary("places");
  const { fetchPlaceDetail } = useFetchPlaceDetails();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: 0,
    address: "",
    coordinate: "",
    images: [] as string[],
  });
  const [newImage, setNewImage] = useState("");

  // Place autocomplete states
  const [destination, setDestination] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [fetchingPlaceDetails, setFetchingPlaceDetails] = useState(false);

  const { suggestions, isLoading } = useAutocompleteSuggestions(destination, {
    includedPrimaryTypes: [
      "lodging",
      "tourist_attraction",
      "point_of_interest",
    ],
  });

  // Debug log for suggestions
  React.useEffect(() => {
    console.log("Destination:", destination);
    console.log("Suggestions:", suggestions);
    console.log("IsLoading:", isLoading);
  }, [destination, suggestions, isLoading]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceSelect = useCallback(
    async (
      suggestion: {
        placePrediction: google.maps.places.PlacePrediction | null;
      } | null
    ) => {
      if (suggestion?.placePrediction && placesLib) {
        setSelectedPlace({ placePrediction: suggestion.placePrediction });
        setDestination(suggestion.placePrediction.mainText + "");
        setAutocompleteOpen(false);
        setFetchingPlaceDetails(true);

        try {
          const placeId = suggestion.placePrediction.placeId || "";
          if (placeId) {
            const placeDetails = await fetchPlaceDetail(placeId);

            if (placeDetails) {
              // Map place details to hotel form fields
              const placeName = placeDetails.displayName || "";
              const placeAddress = placeDetails.formattedAddress || "";
              const placeRating = placeDetails.rating || 0;
              const placeLocation = placeDetails.location;

              // Create coordinate object (not string)
              let coordinateObj = null;
              if (placeLocation) {
                coordinateObj = {
                  latitude: placeLocation.lat(),
                  longitude: placeLocation.lng(),
                };
              }

              // Extract photos for images
              const imageUrls: string[] = [];
              if (placeDetails.photos && placeDetails.photos.length > 0) {
                placeDetails.photos.slice(0, 3).forEach((photo, index) => {
                  const photoUrl = photo.getURI({
                    maxWidth: 800,
                    maxHeight: 600,
                  });
                  if (photoUrl) {
                    imageUrls.push(
                      `${placeName.toLowerCase().replace(/\s+/g, "-")}-${
                        index + 1
                      }.jpg`
                    );
                  }
                });
              }

              // Update form data with place information
              setFormData((prev) => ({
                ...prev,
                name: placeName,
                address: placeAddress,
                rating: placeRating,
                coordinate: coordinateObj ? JSON.stringify(coordinateObj) : "",
                images: imageUrls,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
        } finally {
          setFetchingPlaceDetails(false);
        }
      }
    },
    [placesLib, fetchPlaceDetail]
  );

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    // Convert coordinate string to object for API
    let coordinateObj;
    try {
      coordinateObj = formData.coordinate
        ? JSON.parse(formData.coordinate)
        : null;
    } catch (error) {
      console.error("Invalid coordinate format:", error);
      coordinateObj = null;
    }

    const hotelData = {
      name: formData.name,
      description: formData.description,
      rating: formData.rating,
      address: formData.address,
      coordinate: coordinateObj, // Send as object to match backend DTO
      images: formData.images, // Use 'images' not 'image' to match backend DTO
    };
    onSave(hotelData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      rating: 0,
      address: "",
      coordinate: "",
      images: [],
    });
    setNewImage("");
    // Reset autocomplete states
    setDestination("");
    setSelectedPlace(null);
    setAutocompleteOpen(false);
    setFetchingPlaceDetails(false);
    onClose();
  };

  const isFormValid =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.address.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Add New Hotel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter hotel details and information
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Basic Information
            </Typography>
            <Stack spacing={2}>
              {/* Place Search Autocomplete */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  <LocationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Search Place (Auto-fill hotel information)
                </Typography>
                <Autocomplete
                  id="place-autocomplete"
                  open={autocompleteOpen}
                  onOpen={() => {
                    if (destination.length >= 2) setAutocompleteOpen(true);
                  }}
                  onClose={() => setAutocompleteOpen(false)}
                  isOptionEqualToValue={(option, value) =>
                    option.placePrediction?.placeId ===
                    value.placePrediction?.placeId
                  }
                  getOptionLabel={(option) =>
                    String(
                      option.placePrediction?.mainText ||
                        option.placePrediction?.text ||
                        ""
                    )
                  }
                  options={suggestions}
                  loading={isLoading || fetchingPlaceDetails}
                  value={selectedPlace}
                  onChange={(_, newValue) => handlePlaceSelect(newValue)}
                  inputValue={destination}
                  onInputChange={(_, newInputValue, reason) => {
                    // Only update destination if user is typing, not when clearing
                    if (reason === "input") {
                      setDestination(newInputValue);
                      if (newInputValue.length >= 2) {
                        setAutocompleteOpen(true);
                      } else {
                        setAutocompleteOpen(false);
                      }
                    }
                  }}
                  // Fix z-index issue with dialog
                  slotProps={{
                    popper: {
                      style: { zIndex: 1400 },
                    },
                  }}
                  // Always show dropdown arrow
                  forcePopupIcon={true}
                  // Don't clear input when losing focus
                  clearOnBlur={false}
                  // Don't clear input when escape is pressed
                  clearOnEscape={false}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {String(option.placePrediction?.mainText || "")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {String(option.placePrediction?.secondaryText || "")}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      placeholder="Search for hotels, attractions, or places..."
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading || fetchingPlaceDetails ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      helperText="Search and select a place to auto-fill hotel information"
                    />
                  )}
                />
              </Box>

              <TextField
                label="Hotel Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                required
                disabled={fetchingPlaceDetails}
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                fullWidth
                multiline
                rows={3}
                required
                disabled={fetchingPlaceDetails}
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                fullWidth
                required
                disabled={fetchingPlaceDetails}
              />
              <TextField
                label="Coordinate (JSON format)"
                value={formData.coordinate}
                onChange={(e) =>
                  handleInputChange("coordinate", e.target.value)
                }
                fullWidth
                placeholder="{'latitude': 12.2388, 'longitude': 109.1967}"
                helperText="Enter coordinates in JSON format or auto-filled from place search"
                disabled={fetchingPlaceDetails}
              />
            </Stack>
          </Box>

          {/* Rating */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Rating
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Rating
                value={formData.rating}
                onChange={(_, newValue) =>
                  handleInputChange("rating", newValue || 0)
                }
                precision={0.1}
                size="large"
                disabled={fetchingPlaceDetails}
              />
              <Typography variant="body1" fontWeight={500}>
                {formData.rating.toFixed(1)}
              </Typography>
              {fetchingPlaceDetails && (
                <Typography variant="body2" color="text.secondary">
                  (Auto-filling from place data...)
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Images */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Images
            </Typography>

            {/* Add Image */}
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <TextField
                label="Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter image URL or filename"
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddImage}
                disabled={!newImage.trim()}
                size="small"
              >
                Add
              </Button>
            </Stack>

            {/* Image List */}
            {formData.images.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Added Images ({formData.images.length})
                </Typography>
                <Stack spacing={1}>
                  {formData.images.map((image, index) => (
                    <Chip
                      key={index}
                      label={image}
                      onDelete={() => handleRemoveImage(index)}
                      deleteIcon={<DeleteIcon />}
                      variant="outlined"
                      sx={{ justifyContent: "space-between" }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !isFormValid}
          startIcon={loading ? undefined : <SaveIcon />}
        >
          {loading ? "Adding..." : "Add Hotel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHotelDialog;
