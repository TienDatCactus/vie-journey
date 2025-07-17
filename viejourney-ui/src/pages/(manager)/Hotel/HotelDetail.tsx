import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../layouts";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Rating,
  Avatar,
  Grid2,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { doGetHotelById } from "../../../services/api";
import EditHotelDialog from "./EditHotelDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { Hotel } from "../../../utils/interfaces";

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHotelDetail = async () => {
      if (!id) {
        setError("Hotel ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const hotelData = await doGetHotelById(id);

        // Process the response data
        const processedHotel: Hotel = {
          _id: hotelData._id,
          name: hotelData.name,
          description: hotelData.description,
          rating: hotelData.rating,
          address: hotelData.address,
          coordinate: hotelData.coordinate,
          // Parse image array if it's a string
          images: Array.isArray(hotelData.image)
            ? hotelData.image
                .map((img: string) => {
                  // If image is in format "['img1.jpg', 'img2.jpg']", parse it
                  if (img.startsWith("[") && img.endsWith("]")) {
                    try {
                      return JSON.parse(img.replace(/'/g, '"'));
                    } catch {
                      return [img];
                    }
                  }
                  return img;
                })
                .flat()
            : hotelData.image || [],
        };

        setHotel(processedHotel);
        setError(null);
      } catch (err) {
        console.error("Error fetching hotel detail:", err);
        setError("Failed to load hotel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [id]);

  const handleBack = () => {
    navigate("/manager/hotels");
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleUpdateHotel = async () => {
    // Refresh hotel data after successful update
    if (!id) return;

    setLoading(true);
    try {
      const hotelData = await doGetHotelById(id);
      const processedHotel: Hotel = {
        _id: hotelData._id,
        name: hotelData.name,
        description: hotelData.description,
        rating: hotelData.rating,
        address: hotelData.address,
        coordinate: hotelData.coordinate,
        images: Array.isArray(hotelData.image)
          ? hotelData.image
              .map((img: string) => {
                if (img.startsWith("[") && img.endsWith("]")) {
                  try {
                    return JSON.parse(img.replace(/'/g, '"'));
                  } catch {
                    return [img];
                  }
                }
                return img;
              })
              .flat()
          : hotelData.image || [],
      };

      setHotel(processedHotel);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error refreshing hotel data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteHotel = async () => {
    // Navigate back to hotel list after successful delete
    navigate("/manager/hotels");
  };

  const parseCoordinate = (coordinateStr: string) => {
    try {
      // Handle coordinate string like "{'latitude': 12.2388, 'longitude': 109.1967}"
      const cleanStr = coordinateStr.replace(/'/g, '"');
      const coord = JSON.parse(cleanStr);
      return {
        latitude: coord.latitude,
        longitude: coord.longitude,
      };
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          {/* Header Skeleton */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={300} height={20} />
            </Box>
          </Stack>

          {/* Content Skeleton */}
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 3 }}>
                <Skeleton variant="text" width={150} height={30} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{ mt: 2 }}
                />
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3 }}>
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
              </Paper>
            </Grid2>
          </Grid2>
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold">
              Hotel Detail
            </Typography>
          </Stack>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Back to Hotel List
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  if (!hotel) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold">
              Hotel Detail
            </Typography>
          </Stack>

          <Alert severity="warning" sx={{ mb: 3 }}>
            Hotel not found.
          </Alert>

          <Button variant="contained" onClick={handleBack}>
            Back to Hotel List
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  const coordinate = parseCoordinate(hotel.coordinate);

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {hotel.name}
              </Typography>
              <Typography color="text.secondary">
                Hotel Details & Information
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ textTransform: "none" }}
            >
              Edit Hotel
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ textTransform: "none" }}
            >
              Delete Hotel
            </Button>
          </Stack>
        </Stack>

        <Grid2 container spacing={3}>
          {/* Main Content */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            {/* Basic Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  <HotelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {hotel.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={hotel.rating} readOnly precision={0.1} />
                    <Typography variant="body1" fontWeight={500}>
                      {hotel.rating}
                    </Typography>
                    <Chip
                      label={`${hotel.rating} Stars`}
                      size="small"
                      color="primary"
                    />
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.6}
                >
                  {hotel.description}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Address
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationIcon color="action" />
                  <Typography variant="body1">{hotel.address}</Typography>
                </Stack>
              </Box>

              {coordinate && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Coordinates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latitude: {coordinate.latitude}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Longitude: {coordinate.longitude}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Images */}
            {hotel.images && hotel.images.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Images ({hotel.images.length})
                </Typography>
                <Grid2 container spacing={2}>
                  {hotel.images.map((image, index) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`https://placehold.co/400x300/e0e0e0/666666?text=${encodeURIComponent(
                            image
                          )}`}
                          alt={`${hotel.name} - Image ${index + 1}`}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {image}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))}
                </Grid2>
              </Paper>
            )}
          </Grid2>

          {/* Sidebar */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            {/* Quick Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Quick Information
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Hotel ID
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {hotel._id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StarIcon color="warning" fontSize="small" />
                    <Typography variant="body1" fontWeight={500}>
                      {hotel.rating} / 5.0
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Images
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ImageIcon color="action" fontSize="small" />
                    <Typography variant="body1" fontWeight={500}>
                      {hotel.images?.length || 0} images
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Actions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Edit Hotel
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Delete Hotel
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleBack}
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Back to List
                </Button>
              </Stack>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Edit Hotel Dialog */}
        <EditHotelDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          hotel={hotel}
          onUpdate={handleUpdateHotel}
          loading={loading}
        />

        {/* Delete Hotel Dialog */}
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDeleteHotel}
          loading={loading}
          hotelId={hotel?._id || ""}
          hotelName={hotel?.name || ""}
        />
      </Box>
    </AdminLayout>
  );
};

export default HotelDetail;
