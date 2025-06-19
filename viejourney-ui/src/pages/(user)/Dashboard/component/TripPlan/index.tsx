"use client"

import { Add } from "@mui/icons-material"
import { Box, Button, Grid, Typography } from "@mui/material"
import type React from "react"
import TripCard from "./Card"

interface TripData {
  id: string
  title: string
  user: string
  dateRange: string
  places: number
  backgroundImage?: string
}

const tripData: TripData[] = [
  {
    id: "1",
    title: "Trip to Paris",
    user: "User",
    dateRange: "Jan, 2023 - Jan, 2023",
    places: 5,
  },
  {
    id: "2",
    title: "Weekend in New York",
    user: "User",
    dateRange: "Feb, 2023 - Feb, 2023",
    places: 3,
  },
]



const TripPlans: React.FC = () => {
  return (
    <Box className="lg:w-[900px] xl:w-[1200px] bg-gray-50 mt-[30px]">
      <Box className="">
        {/* Header */}
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
            startIcon={<Add />}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md"
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
          {tripData.map((trip) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={trip.id}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default TripPlans
