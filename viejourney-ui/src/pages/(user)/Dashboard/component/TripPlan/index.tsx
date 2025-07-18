"use client";

import { Add, Public } from "@mui/icons-material";
import { Box, Button, Grid2, Typography } from "@mui/material";
import type React from "react";
import { useTripDetailStore } from "../../../../../services/stores/useTripDetailStore";
import TripCard from "./Card";
import { Link } from "react-router-dom";

const TripPlans: React.FC = () => {
  const { trips } = useTripDetailStore();
  if (trips.length === 0) {
    return (
      <Box
        sx={{
          maxWidth: "125rem",
          mx: "auto",
          backgroundColor: "#fafafa",
          py: 4,
        }}
      >
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 6,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  mb: 1,
                }}
              >
                Trip Plannings
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                Start traveling with personalized guides
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              // onClick={handleCreateGuide}
              sx={{
                backgroundColor: "#2c2c2c",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              Start Planning
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Public
                sx={{
                  fontSize: 60,
                  color: "#bbb",
                  strokeWidth: 1,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333",
                mb: 2,
              }}
            >
              No trip yet
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                maxWidth: "400px",
                lineHeight: 1.6,
              }}
            >
              Start diving into your adventures by creating your first trip
            </Typography>

            <Link to="/trips/create">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2c2c2c",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "16px",
                }}
              >
                Plan your first trip
              </Button>
            </Link>
          </Box>
        </div>
      </Box>
    );
  }
  console.log(trips);
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

          <Link to="/trips/create">
            <Button
              variant="contained"
              startIcon={<Add />}
              className="bg-gray-800 rounded-sm hover:bg-gray-900 text-white px-4 py-2  shadow-md"
              sx={{
                backgroundColor: "#1f2937",
                "&:hover": {
                  backgroundColor: "#111827",
                },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Plan a new Trip
            </Button>
          </Link>
        </Box>

        {/* Trip Cards Grid */}
        <Grid2 container spacing={3}>
          {!!trips &&
            trips?.length > 0 &&
            trips.map((trip) => (
              <Grid2
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
                key={trip._id}
              >
                <TripCard trip={trip} />
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default TripPlans;
