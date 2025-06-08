import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Rating,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { POIData } from "../types";
import { PLACE_CATEGORIES } from "./CategoryFilter";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import NoResultsIcon from "@mui/icons-material/SearchOff";

interface PlaceResultsProps {
  places: POIData[];
  isLoading: boolean;
  onResultClick: (place: POIData) => void;
  onClose: () => void;
  open: boolean;
}

const getCategoryIcon = (place: POIData) => {
  const placeTypes = place.types || [];

  // Find the first matching category
  for (const category of PLACE_CATEGORIES) {
    if (category.placeTypes.some((type) => placeTypes.includes(type))) {
      return {
        icon: category.icon,
        color: category.color,
      };
    }
  }

  // Default icon if no match
  return {
    icon: <PlaceIcon />,
    color: "#9e9e9e",
  };
};

const formatPriceLevel = (
  level?: google.maps.places.PriceLevel | null
): string => {
  if (level === undefined || level === null) return "";
  return "$".repeat(Number(level));
};

const PlaceResults: React.FC<PlaceResultsProps> = ({
  places,
  isLoading,
  onResultClick,
  onClose,
  open,
}) => {
  if (!open) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 350,
        maxWidth: "calc(100% - 40px)",
        maxHeight: "calc(100% - 180px)",
        borderRadius: 2,
        bgcolor: "rgba(255, 255, 255, 0.95)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isLoading ? "Searching..." : `${places.length} Results`}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : places.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <NoResultsIcon
              sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }}
            />
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              No results found in this area
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.disabled" }}>
              Try adjusting your search or moving the map
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {places.map((place, index) => {
              const categoryInfo = getCategoryIcon(place);

              return (
                <React.Fragment key={place.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    onClick={() => onResultClick(place)}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${categoryInfo.color}22`,
                          color: categoryInfo.color,
                        }}
                      >
                        {React.cloneElement(
                          categoryInfo.icon as React.ReactElement,
                          {}
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ fontWeight: 500 }}
                        >
                          {place.displayName}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          {place.rating !== undefined && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Rating
                                value={place.rating}
                                readOnly
                                precision={0.5}
                                size="small"
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {place.rating}{" "}
                                {place.userRatingCount &&
                                  `(${place.userRatingCount})`}
                              </Typography>
                            </Box>
                          )}
                          {place.types && place.types.length > 0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {place.types[0].replace(/_/g, " ")}
                              {place.priceLevel !== undefined &&
                                place.priceLevel !== null && (
                                  <span>
                                    {" "}
                                    • {formatPriceLevel(place.priceLevel)}
                                  </span>
                                )}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default PlaceResults;
