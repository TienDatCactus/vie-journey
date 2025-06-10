import { MyLocation } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useMap } from "@vis.gl/react-google-maps";
import React, { useState } from "react";

interface CurrentLocationControlProps {
  zoomLevel?: number;
  onLocationFound?: (position: GeolocationPosition) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
}

const CurrentLocationControl: React.FC<CurrentLocationControlProps> = ({
  zoomLevel = 15,
  onLocationFound,
}) => {
  const mapInstance = useMap(); // Direct map instance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLng | null>(null);
  const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(
    null
  );
  const centerToCurrentLocation = () => {
    if (!mapInstance) return;

    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords; // Center the map to the current position
        mapInstance.panTo({ lat: latitude, lng: longitude });
        setCurrentLocation(new google.maps.LatLng(latitude, longitude));
        // Safely check and set zoom level
        const currentZoom = mapInstance.getZoom();
        if (typeof currentZoom === "number" && currentZoom < zoomLevel) {
          mapInstance.setZoom(zoomLevel);
        } // Add a marker for the current location
        if (currentMarker) {
          currentMarker.setPosition({ lat: latitude, lng: longitude });
          currentMarker.setMap(mapInstance);
        } else {
          setCurrentMarker(
            new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: mapInstance,
              title: "Your location",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 8,
              },
              animation: google.maps.Animation.BOUNCE,
            })
          );
        }

        // Call callback if provided
        if (onLocationFound) {
          onLocationFound(position);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error getting current location:", error);
        setError(`Unable to get your location: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 80,
        right: 10,
        zIndex: 5,
      }}
    >
      <Tooltip
        title={error || "Center to your current location"}
        placement="left"
      >
        <IconButton
          onClick={centerToCurrentLocation}
          sx={{
            backgroundColor: "white",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "white",
              opacity: 0.9,
            },
            color: error
              ? "error.main"
              : currentLocation
              ? "primary.main"
              : "text.secondary",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            <MyLocation />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CurrentLocationControl;
