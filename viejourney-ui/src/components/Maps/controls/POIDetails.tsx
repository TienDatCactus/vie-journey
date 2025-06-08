import {
  BookmarkAdd,
  BookmarkAdded,
  Close as CloseIcon,
  LibraryAdd,
  Phone as PhoneIcon,
  Place as PlaceIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid2,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { POIData } from "../types";
import { motion } from "motion/react";

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
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header with image */}
      <div className="relative lg:h-48">
        <Swiper className="mySwiper lg:h-48 rounded-t-lg z-0 w-full">
          {poi.photos && poi.photos.length > 0 ? (
            poi.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <img
                  src={
                    photo.getURI() ||
                    `https://placehold.co/600x400?text=${encodeURIComponent(
                      poi.displayName || "Place"
                    )}`
                  }
                  loading="lazy"
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
        <Grid2 container spacing={2} className="mb-2" alignItems={"start"}>
          <Grid2
            size={{
              xs: 12,
              sm: 8,
              md: 9,
              lg: 10,
            }}
            className=""
          >
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-2xl"
            >
              {poi.displayName}
            </Typography>
            {poi.editorialSummary && (
              <Typography
                variant="body2"
                color="text.primary"
                className="text-base mt-2"
              >
                {poi.editorialSummary}
              </Typography>
            )}
          </Grid2>
          {/* Description */}

          <Grid2
            size={{
              xs: 12,
              sm: 4,
              md: 3,
              lg: 2,
            }}
            className="flex items-center space-x-1"
          >
            <Tooltip
              arrow
              placement="top"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                aria-label="toggle favorite"
                onClick={handleFavoriteToggle}
                size="small"
                sx={{
                  color: isFavorite ? "success.main" : "action.active",
                }}
              >
                {isFavorite ? <BookmarkAdded /> : <BookmarkAdd />}
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Add to trip">
              <IconButton
                size="small"
                // onClick={() => onAddToTrip(poi)}
              >
                <LibraryAdd />
                {/* <LibraryAddCheck/> */}
              </IconButton>
            </Tooltip>
          </Grid2>
        </Grid2>
        {/* Rating */}
        {poi.rating && (
          <div className="flex items-center my-4">
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
        <Grid2 container spacing={2} className="mt-4">
          <Grid2
            size={{
              xs: 12,
              sm: 6,
              md: 6,
            }}
          >
            {/* Address */}
            {poi.formattedAddress && (
              <div className="flex items-center my-2">
                <PlaceIcon fontSize="small" className="text-neutral-600 mr-2" />
                <Typography variant="body2">{poi.formattedAddress}</Typography>
              </div>
            )}

            {/* Opening hours */}
            {poi.regularOpeningHours && (
              <div className="flex items-center my-2">
                <TimeIcon fontSize="small" className="text-neutral-600 mr-2" />
                <div>
                  <Typography variant="body2">
                    {formatOpeningHours()}
                  </Typography>
                </div>
              </div>
            )}

            {/* Phone */}
            {(poi.nationalPhoneNumber || poi.internationalPhoneNumber) && (
              <div className="flex items-center">
                <PhoneIcon fontSize="small" className="mr-2 text-neutral-600" />
                <Link
                  href={`tel:${poi.nationalPhoneNumber}`}
                  underline="hover"
                  variant="body2"
                  color="primary"
                >
                  {poi.nationalPhoneNumber}
                </Link>
                <Divider
                  orientation="vertical"
                  flexItem
                  className="border-neutral-900 ml-2"
                />
                <Link
                  href={`tel:${poi.internationalPhoneNumber}`}
                  underline="hover"
                  variant="body2"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  {poi.internationalPhoneNumber}
                </Link>
              </div>
            )}

            {/* Website */}
            {poi.websiteURI && (
              <div className="flex items-center mt-2">
                <WebsiteIcon
                  fontSize="small"
                  className="mr-2 text-neutral-600"
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
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 6 }}></Grid2>
        </Grid2>
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
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Top reviews
            </Typography>
            {poi.reviews.slice(0, 2).map((review, index) => (
              <Box key={index} sx={{ ml: 2, my: 2 }}>
                <div className="flex items-center">
                  <Avatar
                    alt={review.authorAttribution?.displayName || "Anonymous"}
                    src={review.authorAttribution?.photoURI + ""}
                    className="w-8 h-8 mr-2"
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {review.authorAttribution?.displayName || "Anonymous"}
                  </Typography>
                  <div className="flex items-center ml-2">
                    <StarIcon
                      sx={{ color: "#faaf00", fontSize: "1rem", mr: 0.5 }}
                    />
                    <Typography variant="body2">{review.rating}</Typography>
                  </div>
                </div>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {review.relativePublishTimeDescription}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {poi.googleMapsURI && (
          <Button
            href={poi.googleMapsURI}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-900 px-4 text-neutral-900 text-sm mt-3 rounded-full"
            startIcon={
              <img
                src="/icons/icons8-google.svg"
                alt="Google Maps"
                width="20"
                height="20"
              />
            }
          >
            Google
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default POIDetails;
