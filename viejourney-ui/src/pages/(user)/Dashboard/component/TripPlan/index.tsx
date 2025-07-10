"use client";

import { Add } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import type React from "react";
import TripCard from "./Card";
import { useTripDetailStore } from "../../../../../services/stores/useTripDetailStore";

// const tripData: TripData[] = [
//   {
//     id: "1",
//     title: "Trip to Paris",
//     user: "User",
//     dateRange: "Jan, 2023 - Jan, 2023",
//     places: 5,
//   },
//   {
//     id: "2",
//     title: "Weekend in New York",
//     user: "User",
//     dateRange: "Feb, 2023 - Feb, 2023",
//     places: 3,
//   },
// ];

const TripPlans: React.FC = () => {
  const { trips } = useTripDetailStore();

  return (
    <Box className="max-w-[125rem] mx-auto bg-gray-50  my-4">
      <Box className="">
        <Box className="flex justify-between items-start mb-8">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
              Trip Plans
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Manage your travel itineraries
            </Typography>
          </Box>

          <Button
            variant="contained"
            href="/trips/create"
            startIcon={<Add />}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2  shadow-md"
            sx={{
              backgroundColor: "#1f2937",
              "&:hover": {
                backgroundColor: "#111827",
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            New Trip
          </Button>
        </Box>

        {/* Trip Cards Grid */}
        <Grid container spacing={3}>
          {trips && trips.length > 0 ? (
            trips.map((trip: any) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={trip._id}>
                <TripCard trip={trip} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
                flexDirection="column"
                width="100%"
              >
                <Typography
                  variant="h6"
                  color="textSecondary"
                  className="text-center"
                >
                  No trips found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Start planning your first trip by clicking "New Trip"
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default TripPlans;
