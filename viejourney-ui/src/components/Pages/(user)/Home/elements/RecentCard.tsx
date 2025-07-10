import { Add, Place } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";

interface RecentCardProps {
  tripId?: string;
  place?: string;
  title?: string;
  from?: string;
  to?: string;
  img?: string;
  blank?: boolean;
}

const RecentCard = ({
  tripId,
  title,
  place,
  to,
  from,
  img,
  blank,
}: RecentCardProps) => {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleClose = () => {
    setContextMenu(null);
  };

  if (blank) {
    return (
      <Card className="h-full flex items-center border-2  border-dashed border-neutral-500 justify-center p-4">
        <CardActionArea
          href="/trips/create"
          className="flex flex-col gap-2 items-center justify-center w-full h-full"
        >
          <div className="w-fit p-2 rounded-full bg-dark-200">
            <Add className="text-dark-600" />
          </div>
          <h1 className="text-2xl font-semibold">Plan a new trip</h1>
          <p className="text-center text-dark-700">
            Create a new journey to your dream destination
          </p>
          <span className="bg-white text-dark-900 mt-2 px-2 py-1 rounded-sm border-2">
            Get started
          </span>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
      </Menu>

      <div className="relative">
        <CardMedia
          component="img"
          image={
            img ||
            `https://placehold.co/600x400/1a1a1a/ffffff?text=${title
              ?.split(" ")
              .join("+")}`
          }
          alt={title}
          className="h-[12.5rem] object-cover z-0"
        />
        <Chip
          label={`Upcoming`}
          className="absolute top-2 right-2 z-10 bg-neutral-100"
        />
        <Typography
          gutterBottom
          component="h1"
          className="absolute lg:bottom-2 lg:left-4 z-10 text-white text-lg font-semibold"
        >
          {title}
        </Typography>
        <div className="mask-b-from-20% mask-b-to-80%" />
      </div>

      <CardContent className="p-2">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"column"} gap={1} justifyContent={"space-evenly"}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <CalendarIcon className="text-neutral-600" />
              <Typography variant="body2" color="text.secondary">
                {dayjs(from).format("MMM, YYYY")} -{" "}
                {dayjs(to).format("MMMM, YYYY")}
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Place className="text-neutral-600" />
              <Typography variant="body2" color="text.secondary">
                {place}
              </Typography>
            </Stack>
          </Stack>
          <Link to={`/trips/edit/${tripId}`}>
            <Button
              className="text-dark-900 bg-neutral-300 shadow-none"
              variant="contained"
            >
              View details
            </Button>
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecentCard;
