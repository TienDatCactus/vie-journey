import { CalendarToday } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Trip } from "../../../../../../services/stores/storeTypes";
import { useAuthStore } from "../../../../../../services/stores/useAuthStore";

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  const { info } = useAuthStore();
  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Card Header with Background */}
      {trip?.coverImage?.url ? (
        <img
          src={trip.coverImage?.url}
          alt={trip.title}
          className="h-50 w-full object-cover"
        />
      ) : (
        <Box
          className="h-50 flex items-center justify-center text-white font-semibold text-xl"
          sx={{
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {trip?.title}
        </Box>
      )}
      {/* Card Content */}
      <CardContent className="p-4">
        <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
          {trip?.title}
        </Typography>

        {/* User Info */}
        <Box className="flex items-center mb-2">
          <Avatar
            className="w-6 h-6 mr-2 text-xs"
            sx={{
              bgcolor: "#e5e7eb",
              color: "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            {info?.fullName?.charAt(0).toUpperCase() || "V"}
          </Avatar>
          <Typography variant="body2" className="text-gray-600 mr-3">
            {trip.tripmates.length} Tripmates
          </Typography>
          <CalendarToday className="w-4 h-4 text-gray-400 mr-1" />
          <h2 className="text-gray-600">
            {dayjs(trip.startDate).format("MMM D, YYYY")} -{" "}
            {dayjs(trip.endDate).format("MMM D, YYYY")}
          </h2>
        </Box>

        <Link to={`/trips/${trip._id}`}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            className="mt-2 rounded-sm border-gray-300 hover:bg-gray-100"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TripCard;
