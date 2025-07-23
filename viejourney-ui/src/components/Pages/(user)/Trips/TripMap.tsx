import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import Map from "../../../Maps/Map";

const TripMap: React.FC = () => {
  const trip = useTripDetailStore((state) => state.trip);
  if (!trip.destination?.location) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress />
        <p>No trip data available</p>
      </Box>
    );
  }
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Map
        position="relative"
        defaultCenter={{
          lat: trip.destination?.location.lat,
          lng: trip.destination?.location.lng,
        }}
        defaultZoom={10}
        containerStyle={{ width: "100%", height: "100%" }}
        detailed={true}
      />
    </Box>
  );
};

export default TripMap;
