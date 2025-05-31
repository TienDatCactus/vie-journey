import {
  Add as AddIcon,
  Close as CloseIcon,
  DirectionsWalk as DirectionsIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  AccessTime as TimeIcon,
  Language as WebIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { POIData } from "./Map";

interface POIDetailsProps {
  poi: POIData;
  onClose: () => void;
  onAddToTrip?: (poiId: string) => void;
  onToggleFavorite?: (poiId: string, isFavorite: boolean) => void;
}

// Helper function to format place types into readable categories
const formatPlaceType = (type: string): string => {
  const typeMap: Record<string, string> = {
    restaurant: "Restaurant",
    cafe: "Café",
    bar: "Bar",
    lodging: "Hotel",
    museum: "Museum",
    park: "Park",
    point_of_interest: "Attraction",
    tourist_attraction: "Tourist Attraction",
    // Add more mappings as needed
  };

  return (
    typeMap[type] ||
    type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

const POIDetails: React.FC<POIDetailsProps> = ({
  poi,
  onClose,
  onAddToTrip,
  onToggleFavorite,
}) => {
  // Default favorite state
  const [isFavorite, setIsFavorite] = React.useState(false);

  // Get primary type for display
  const primaryType =
    poi.types?.find(
      (type) => type !== "point_of_interest" && type !== "establishment"
    ) || "point_of_interest";

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggleFavorite) {
      onToggleFavorite(poi.id, newState);
    }
  };

  // Get photo URL or fallback
  // const photoUrl = poi?.photos?.[0]?.getURI() || "";

  // Format price level
  const formatPriceLevel = (
    level?: google.maps.places.PriceLevel | number | null
  ) => {
    if (level === undefined || level === null) return "";
    // Convert level to number if it's a PriceLevel enum
    const numericLevel = typeof level === "number" ? level : Number(level);
    return Array(numericLevel + 1).join("$");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with image */}
      <Box sx={{ position: "relative", height: 200 }}>
        {/* <img
          src={photoUrl}
          alt={poi.name}
          className="w-full h-full object-cover"
        /> */}

        {/* Overlay for better contrast with buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          }}
        />

        {/* Close button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {/* Favorite button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 56,
            color: isFavorite ? "#f44336" : "white",
            backgroundColor: "rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Place type badge */}
        <Chip
          label={formatPlaceType(primaryType)}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.85)",
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Content area */}
      <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
        {/* Name and rating */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {poi.name}
        </Typography>

        {/* Rating */}
        {poi.rating !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating value={poi.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {poi.rating?.toFixed(1)}
              {poi.userRatingCount !== undefined &&
                poi.userRatingCount !== null &&
                ` (${poi.userRatingCount.toLocaleString()})`}
            </Typography>
          </Box>
        )}

        {/* Address */}
        {poi.address && (
          <Box sx={{ display: "flex", mt: 2, mb: 2 }}>
            <PlaceIcon color="action" sx={{ mr: 1, fontSize: 20, mt: 0.3 }} />
            <Typography variant="body2">{poi.address}</Typography>
          </Box>
        )}

        {/* Price level */}
        {poi.priceLevel !== undefined && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Price Level: {formatPriceLevel(poi.priceLevel)}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Opening hours */}
        {poi.regularOpeningHours &&
          poi.regularOpeningHours.periods.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TimeIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight={500}>
                  {poi.isOpen ? "Open Now" : "Closed Now"}
                </Typography>
              </Box>
              <List dense sx={{ pl: 4 }}>
                {poi.regularOpeningHours?.periods?.map((day, index) => (
                  <ListItem key={index} sx={{ p: 0 }}>
                    <Typography variant="body2">{day?.open?.day}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

        {/* Contact info */}
        {(poi.phoneNumber || poi.websiteUri) && (
          <Box sx={{ mb: 2 }}>
            {poi.phoneNumber && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon color="action" sx={{ mr: 1 }} />
                <Link href={`tel:${poi.phoneNumber}`} variant="body2">
                  {poi.phoneNumber}
                </Link>
              </Box>
            )}

            {poi.websiteUri && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WebIcon color="action" sx={{ mr: 1 }} />
                <Link
                  href={poi.websiteUri}
                  target="_blank"
                  variant="body2"
                  sx={{ wordBreak: "break-all" }}
                >
                  {poi.websiteUri}
                </Link>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Actions footer */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Get directions button */}
          {poi.location && (
            <Button
              variant="outlined"
              startIcon={<DirectionsIcon />}
              sx={{ flex: 1 }}
              href={`https://www.google.com/maps/dir/?api=1&destination=${poi.location.lat},${poi.location.lng}`}
              target="_blank"
            >
              Directions
            </Button>
          )}

          {/* Add to trip button */}
          {onAddToTrip && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              sx={{ flex: 1 }}
              onClick={() => onAddToTrip(poi.id)}
            >
              Add to Trip
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default POIDetails;
