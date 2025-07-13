import { CalendarMonth, NavigateNext } from "@mui/icons-material";
import { Grid2, IconButton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Trip } from "../../../../../services/stores/storeTypes";

const TripTag = ({ trip }: { trip: Trip }) => {
  return (
    <Stack className="w-full  shadow-none bg-inherit h-20">
      <Stack
        direction={"row"}
        className="h-full"
        justifyContent={"space-between"}
      >
        <Grid2
          container
          justifyContent={"space-between"}
          spacing={2}
          alignItems={"center"}
          flexDirection={"row"}
          className="w-full h-full"
        >
          <Grid2 size={2}>
            <img
              className="w-20 h-20 rounded-md object-cover"
              alt={trip?.title}
              src={
                // trip?.coverImage ||
                `https://placehold.co/600x400/1a1a1a/ffffff?text=${trip?.title
                  .split(" ")
                  .join("+")}`
              }
            />
          </Grid2>
          <Grid2 size={10} className="p-0 flex-grow">
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <div>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  className="text-[18px]"
                >
                  {trip?.title}
                </Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <CalendarMonth className="text-base text-neutral-700" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="text-sm"
                  >
                    {dayjs(trip?.startDate).format("MMM DD, YYYY")} -{" "}
                    {dayjs(trip?.endDate).format("MMM DD, YYYY")}
                  </Typography>
                </Stack>
              </div>
              <Link to={`/trips/plan/${trip?._id}`}>
                <IconButton>
                  <NavigateNext className="text-base" />
                </IconButton>
              </Link>
            </Stack>
          </Grid2>
        </Grid2>
      </Stack>
    </Stack>
  );
};

export default TripTag;
