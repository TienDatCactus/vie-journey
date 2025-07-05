import { Box } from "@mui/material";
import React from "react";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import Map from "../../../Maps/Map";

const TripMap: React.FC = () => {
  const trip = useTripDetailStore((state) => state.trip);
  console.log(trip.destination);
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Map
        position="relative"
        defaultCenter={{
          lat: trip.destination?.location.lat, // Default to Paris if not set
          lng: trip.destination?.location.lng, // Default to Paris if not set
        }}
        defaultZoom={13}
        containerStyle={{ width: "100%", height: "100%" }}
        detailed={true}
      />
    </Box>
  );
};

export default TripMap;
