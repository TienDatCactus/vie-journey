import { CalendarMonth, NavigateNext } from "@mui/icons-material";
import { Chip, Grid2, IconButton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

interface TripTagProps {
  places: number;
  title: string;
  from: string;
  to: string;
  img: string;
}

const TripTag = ({ title, places, to, from, img }: TripTagProps) => {
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
        >
          <Grid2 size={3}>
            <img
              className="w-full rounded-md"
              src={
                img ||
                `https://placehold.co/600x400/1a1a1a/ffffff?text=${title
                  .split(" ")
                  .join("+")}`
              }
            />
          </Grid2>
          <Grid2 size={6} className="p-0 flex-grow">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="text-[18px]"
            >
              {title}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <CalendarMonth className="text-base text-neutral-700" />
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-sm"
              >
                {dayjs(from).format("MMM DD, YYYY")} -{" "}
                {dayjs(to).format("MMM DD, YYYY")}
              </Typography>
            </Stack>
          </Grid2>
          <Grid2
            size={3}
            gap={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Chip
              label={`${places} places`}
              className="border border-dark-700 bg-white"
            />
            <IconButton>
              <NavigateNext className="text-base" />
            </IconButton>
          </Grid2>
        </Grid2>
      </Stack>
    </Stack>
  );
};

export default TripTag;
