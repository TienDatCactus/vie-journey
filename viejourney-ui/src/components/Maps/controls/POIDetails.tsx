import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import {
  Place as PlaceIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { POIData } from "../types";

interface POIDetailsProps {
  poi: POIData;
  onClose: () => void;
  onAddToTrip?: (poi: POIData) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

const POIDetails: React.FC<POIDetailsProps> = ({
  poi,
  onClose,
  onAddToTrip,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getPhotoUrl = (photo: any): string => {
    try {
      if (photo && photo.flagContentURI) {
        const imageKeyMatch = photo.flagContentURI.match(/image_key=([^&]+)/);
        if (imageKeyMatch && imageKeyMatch[1]) {
          // The format is typically: !1e10!2sCIHM0ogKEICAgIDBksL6zwE
          const photoRef = imageKeyMatch[1].split("!2s")[1];

          if (photoRef) {
            // Construct the Google Places photo URL with the photo reference
            const p = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${
              photo.widthPx || 800
            }&photoreference=${photoRef}&key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }`;
            console.log(p);
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${
              photo.widthPx || 800
            }&photoreference=${photoRef}&key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }`;
          }
        }

        // Simpler alternative approach if API key is not available or extraction fails:
        // This directly modifies the URL to fetch the image instead of the report form
        return photo.flagContentURI.replace("/report", "/photo");
      }

      // Legacy Places API with getUrl function
      if (photo && typeof photo.getUrl === "function") {
        return photo.getUrl();
      }

      // Handle string URL
      if (typeof photo === "string") {
        return photo;
      }
    } catch (error) {
      console.error("Error processing photo:", error);
    }

    // Fallback to placeholder
    return `https://placehold.co/600x400?text=${encodeURIComponent(
      poi.displayName || "Place"
    )}`;
  };

  const handleFavoriteToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggleFavorite) {
      onToggleFavorite(poi.id, newState);
    }
  };

  const formatPriceLevel = (
    level?: google.maps.places.PriceLevel | number | null
  ): string => {
    if (level === undefined || level === null) return "";

    const numericLevel = typeof level === "number" ? level : Number(level);

    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 4) {
      return "";
    }

    return "$".repeat(numericLevel);
  };

  const formatOpeningHours = (): string => {
    if (!poi.regularOpeningHours) return "Hours not available";

    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.

    if (
      poi.regularOpeningHours.weekdayDescriptions &&
      poi.regularOpeningHours.weekdayDescriptions.length === 7
    ) {
      return poi.regularOpeningHours.weekdayDescriptions[today].split(": ")[1];
    }

    // Otherwise try to get from periods
    if (poi.regularOpeningHours.periods) {
      const todayPeriod = poi.regularOpeningHours.periods.find(
        (period) => period.open.day === today
      );

      if (todayPeriod) {
        const formatTime = (time: { hour: number; minute: number }) => {
          const isPM = time.hour >= 12;
          const hour12 = time.hour % 12 || 12;
          const minutes = time.minute.toString().padStart(2, "0");
          return `${hour12}:${minutes} ${isPM ? "PM" : "AM"}`;
        };

        return `${formatTime(todayPeriod.open)} - ${
          todayPeriod.close
            ? formatTime(todayPeriod.close)
            : "Closing time not available"
        }`;
      }
    }

    return "Hours not available";
  };

  const isOpen = (): boolean | null => {
    if (!poi.regularOpeningHours || !poi.regularOpeningHours.periods)
      return null;

    const now = new Date();
    const today = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const todayPeriod = poi.regularOpeningHours.periods.find(
      (period) => period.open.day === today
    );

    if (todayPeriod) {
      const openTime = todayPeriod.open.hour * 60 + todayPeriod.open.minute;
      const closeTime = todayPeriod?.close
        ? todayPeriod.close.hour * 60 + todayPeriod.close.minute
        : Infinity;
      const currentTime = currentHour * 60 + currentMinute;

      return currentTime >= openTime && currentTime < closeTime;
    }

    return null;
  };

  // Determine if the place is currently open
  const openNow = isOpen();

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with image */}
      <div className="relative lg:h-48">
        <Swiper className="mySwiper lg:h-48 rounded-t-lg z-0 w-full">
          {poi.photos && poi.photos.length > 0 ? (
            poi.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <img
                  src={getPhotoUrl(photo)}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/600x400?text=Image+not+available`;
                  }}
                  alt={`${poi.displayName || "Place"} - photo ${index + 1}`}
                  className="relative h-48 w-full -z-10 object-cover"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <img
                src={`https://placehold.co/600x400?text=${encodeURIComponent(
                  poi.displayName || "Place"
                )}`}
                alt={poi.displayName || "Place"}
                className="relative h-48 w-full -z-10 object-cover"
              />
            </SwiperSlide>
          )}
        </Swiper>
        <Stack className="z-10">
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
        </Stack>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-grow">
        <div className="flex justify-between items-start">
          <Typography variant="h5" component="h2" className="font-bold">
            {poi.displayName}
          </Typography>
          <div className="flex items-center space-x-1">
            <IconButton
              aria-label="toggle favorite"
              onClick={handleFavoriteToggle}
              sx={{
                color: isFavorite ? "error.main" : "action.active",
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            {onAddToTrip && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                size="small"
                onClick={() => onAddToTrip(poi)}
              >
                Add to Trip
              </Button>
            )}
          </div>
        </div>

        {/* Rating */}
        {poi.rating && (
          <div className="flex items-center mt-1">
            <StarIcon
              sx={{
                color: "#faaf00",
                fontSize: "1.25rem",
                marginRight: "4px",
              }}
            />
            <Typography variant="body2" component="span" fontWeight="bold">
              {poi.rating.toFixed(1)}
            </Typography>
            {poi.userRatingCount && (
              <Typography
                variant="body2"
                component="span"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({poi.userRatingCount.toLocaleString()})
              </Typography>
            )}
            {poi.priceLevel && (
              <Typography
                variant="body2"
                component="span"
                sx={{ ml: 1.5, color: "text.secondary" }}
              >
                {formatPriceLevel(poi.priceLevel)}
              </Typography>
            )}
          </div>
        )}

        {/* Status */}
        <div className="mt-1">
          {poi.businessStatus === "OPERATIONAL" && openNow !== null && (
            <Chip
              label={openNow ? "Open Now" : "Closed Now"}
              size="small"
              color={openNow ? "success" : "default"}
              sx={{ mr: 1, mb: 1 }}
            />
          )}

          {/* Types */}
          {poi.types &&
            poi.types
              .filter(
                (type) =>
                  type !== "point_of_interest" && type !== "establishment"
              )
              .slice(0, 3)
              .map((type) => (
                <Chip
                  key={type}
                  label={type.replace(/_/g, " ")}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1, textTransform: "capitalize" }}
                />
              ))}
        </div>

        {/* Address */}
        {poi.formattedAddress && (
          <div className="flex items-start mt-3">
            <PlaceIcon
              fontSize="small"
              sx={{ mr: 1, mt: 0.3, color: "text.secondary" }}
            />
            <Typography variant="body2">{poi.formattedAddress}</Typography>
          </div>
        )}

        {/* Opening hours */}
        {poi.regularOpeningHours && (
          <div className="flex items-start mt-2">
            <TimeIcon
              fontSize="small"
              sx={{ mr: 1, mt: 0.3, color: "text.secondary" }}
            />
            <div>
              <Typography variant="body2">{formatOpeningHours()}</Typography>
            </div>
          </div>
        )}

        {/* Phone */}
        {poi.nationalPhoneNumber && (
          <div className="flex items-center mt-2">
            <PhoneIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Link
              href={`tel:${
                poi.internationalPhoneNumber || poi.nationalPhoneNumber
              }`}
              underline="hover"
              variant="body2"
              color="primary"
            >
              {poi.nationalPhoneNumber}
            </Link>
          </div>
        )}

        {/* Website */}
        {poi.websiteURI && (
          <div className="flex items-center mt-2">
            <WebsiteIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Link
              href={poi.websiteURI}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              variant="body2"
              color="primary"
              sx={{
                maxWidth: "calc(100% - 32px)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {new URL(poi.websiteURI).hostname}
            </Link>
          </div>
        )}

        {/* Description */}
        {poi.editorialSummary && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {poi.editorialSummary}
            </Typography>
          </Box>
        )}

        {/* Amenities/Features */}
        {(poi.isGoodForChildren ||
          poi.hasOutdoorSeating ||
          poi.accessibilityOptions?.hasWheelchairAccessibleEntrance) && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Features & Amenities
            </Typography>
            <div className="flex flex-wrap">
              {poi.isGoodForChildren && (
                <Chip
                  label="Good for children"
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              )}
              {poi.hasOutdoorSeating && (
                <Chip
                  label="Outdoor seating"
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              )}
              {poi.accessibilityOptions?.hasWheelchairAccessibleEntrance && (
                <Chip
                  label="Wheelchair accessible"
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              )}
            </div>
          </Box>
        )}

        {/* Reviews section - can be expanded */}
        {poi.reviews && poi.reviews.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Top review
            </Typography>
            <Box sx={{ ml: 1 }}>
              <div className="flex items-center">
                <Typography variant="body2" fontWeight="bold">
                  {poi?.reviews[0]?.authorAttribution?.displayName ||
                    "Anonymous"}
                </Typography>
                <div className="flex items-center ml-2">
                  <StarIcon
                    sx={{ color: "#faaf00", fontSize: "1rem", mr: 0.5 }}
                  />
                  <Typography variant="body2">
                    {poi.reviews[0].rating}
                  </Typography>
                </div>
              </div>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {poi.reviews[0].relativePublishTimeDescription}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {poi.reviews[0].text}
              </Typography>
            </Box>
            {poi.googleMapsURI && (
              <Link
                href={poi.googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                variant="body2"
                sx={{ display: "block", mt: 2, textAlign: "right" }}
              >
                See all reviews on Google Maps
              </Link>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default POIDetails;
