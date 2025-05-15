import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
interface RecentCardProps {
  places: number;
  title: string;
  from: string;
  to: string;
  img: string;
}

const RecentCard = ({ title, places, to, from, img }: RecentCardProps) => {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const handleClose = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onContextMenu={handleContextMenu}>
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
        <CardMedia
          component="img"
          height="200"
          image={
            img ||
            `https://placehold.co/600x400/1a1a1a/ffffff?text=${title
              .split(" ")
              .join("+")}`
          }
          alt={title}
        />
        <CardContent className="p-2">
          <Typography gutterBottom component="h1">
            {title}
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Avatar className="text-[12px]">User</Avatar>
            <span>•</span>
            <Typography variant="body2" color="text.secondary">
              {dayjs(from).format("MMM, YYYY")} -{" "}
              {dayjs(to).format("MMMM, YYYY")}
            </Typography>
            <span>•</span>
            <Typography variant="body2" color="text.secondary">
              {places} places
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecentCard;
