import { MoreHoriz } from "@mui/icons-material";
import { Avatar, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
interface GuideCardProps {
  img: string;
  title: string;
  likes: number;
  views: number;
}

const GuideCard = ({ img, title, likes, views }: GuideCardProps) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
        <Typography gutterBottom component="h1" className="m-0 text-[1rem]">
          {title}
        </Typography>
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton>
              <FavoriteBorderIcon className="text-[1.125rem]" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likes}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton>
              <VisibilityIcon className="text-[1.125rem]" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {views}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
