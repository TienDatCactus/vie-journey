import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Avatar, Divider, IconButton, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
interface TourCardProps {
  img: string;
  title: string;
  sub: string;
  author: string;
  views: number;
  liked: number;
}

const TourCard = ({ img, title, sub, author, views, liked }: TourCardProps) => {
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={img} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {sub}
          </Typography>
          <Divider className="my-2" />
          <Stack direction={"row"} gap={2} className="h-full ">
            <Avatar sx={{ bgcolor: getRandomColor() }}>
              {author.split("")[0]}
            </Avatar>
            <div>
              <Typography variant="body1">{author}</Typography>
              <Stack
                direction={"row"}
                gap={2}
                alignItems={"center"}
                className="*:text-neutral-700"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <VisibilityIcon className="text-xl" />
                  <Typography variant="body2" color="text.secondary">
                    {views}
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <FavoriteBorderIcon className="text-xl" />
                  <Typography variant="body2" color="text.secondary">
                    {liked}
                  </Typography>
                </Stack>
              </Stack>
            </div>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TourCard;
