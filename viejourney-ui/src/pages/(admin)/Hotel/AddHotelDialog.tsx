import React, { useState } from "react";
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
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string;
  image: string[];
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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: 0,
    address: "",
    coordinate: "",
    images: [] as string[],
  });
  const [newImage, setNewImage] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const hotelData = {
      name: formData.name,
      description: formData.description,
      rating: formData.rating,
      address: formData.address,
      coordinate: formData.coordinate,
      image: formData.images,
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
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.address.trim();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" }
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
              <TextField
                label="Hotel Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                fullWidth
                multiline
                rows={3}
                required
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Coordinate (JSON format)"
                value={formData.coordinate}
                onChange={(e) => handleInputChange("coordinate", e.target.value)}
                fullWidth
                placeholder="{'latitude': 12.2388, 'longitude': 109.1967}"
                helperText="Enter coordinates in JSON format"
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
                onChange={(_, newValue) => handleInputChange("rating", newValue || 0)}
                precision={0.1}
                size="large"
              />
              <Typography variant="body1" fontWeight={500}>
                {formData.rating.toFixed(1)}
              </Typography>
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
