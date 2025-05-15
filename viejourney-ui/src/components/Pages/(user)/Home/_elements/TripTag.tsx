import { Circle, MoreHoriz } from "@mui/icons-material";
import { Avatar, Grid2, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import * as React from "react";

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
          <Grid2 size={8} className="p-0 flex-grow">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="text-[18px]"
            >
              {title}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Avatar sx={{ width: 20, height: 20, fontSize: 12 }}>D</Avatar>
              <Circle className="text-[6px] text-[#ccc]" />
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-[10px]"
              >
                {dayjs(from).format("MMM DD, YYYY")} -{" "}
                {dayjs(to).format("MMM DD, YYYY")}
              </Typography>
              <Circle className="text-[6px] text-[#ccc]" />
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-[10px]"
              >
                {places} places
              </Typography>
            </Stack>
          </Grid2>
          <Grid2 size={1}>
            <IconButton>
              <MoreHoriz className="text-[16px]" />
            </IconButton>
          </Grid2>
        </Grid2>
      </Stack>
    </Stack>
  );
};

export default TripTag;
