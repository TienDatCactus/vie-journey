import { Box } from "@mui/material";
import React, { useState } from "react";
import Map from "../../../Maps/Map";
import { POIData } from "../../../Maps/types";

const TripMap: React.FC = () => {
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);

  const handlePOIClick = (poi: POIData) => {
    setSelectedPOI(poi);
  };

  const handleAddPOIToTrip = (poiId: string) => {
    console.log("Adding POI to trip:", poiId);
  };

  const handleToggleFavorite = (poiId: string, isFavorite: boolean) => {
    console.log("Toggle favorite:", poiId, isFavorite);
    // Implementation for toggling favorite
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Map
        defaultCenter={{ lat: 48.8566, lng: 2.3522 }} // Paris
        defaultZoom={13}
        containerStyle={{ width: "100%", height: "100%" }}
        onPOIClick={handlePOIClick}
      />
    </Box>
  );
};

export default TripMap;
