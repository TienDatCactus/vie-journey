import { Add, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTripDetailStore } from "../../../../../services/stores/useTripDetailStore";
import CardSkeleton from "../../../../../utils/handlers/loading/CardSkeleton";
import TripCard from "./Card";

const TripPlans: React.FC = () => {
  const { trips, handleGetUserTrips } = useTripDetailStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await handleGetUserTrips();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
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
              className="rounded-sm"
              // onClick={handleCreateGuide}
              sx={{
                backgroundColor: "#2c2c2c",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
                textTransform: "none",
                fontWeight: 500,
                py: 1,
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
  if (loading) {
    <div className="relative w-full  flex flex-col justify-center items-center">
      <div className="inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute  w-full h-full flex justify-center items-center ">
        <CircularProgress size={48} />
      </div>
      <div className="w-full max-w-[75rem] mx-auto flex justify-center items-center">
        <CardSkeleton count={3} />
      </div>
    </div>;
  }
  return (
    <Box className="max-w-[125rem] mx-auto  my-4">
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
