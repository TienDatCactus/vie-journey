import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Avatar, IconButton, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface GuideCardProps {
  index: number;
  img: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  views: number;
}

const GuideCard = (props: GuideCardProps) => {
  const { index, img, title, description, author, likes, views } = props;
  return (
    <Card
      sx={{ maxWidth: 345 }}
      elevation={0}
      key={index}
      className="rounded-lg"
    >
      <div className="overflow-hidden rounded-lg">
        <CardMedia
          component="img"
          height="180"
          image={"https://placehold.co/600x400"}
          alt="green iguana"
          className="duration-200 ease-in-out rounded-lg hover:scale-115 cursor-pointer"
        />
      </div>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="my-0 truncate"
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          className="truncate"
        >
          {description}
        </Typography>
        <Stack className="mt-2" direction={"row"} alignItems={"center"} gap={1}>
          <Avatar className="w-[30px] h-[30px] text-[12px]">J</Avatar>
          <h5 className="truncate">{author}</h5>
          <Stack direction={"row"} gap={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <FavoriteBorderIcon className="text-[18px]" />
              </IconButton>
              <p className="m-0">{likes} </p>
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <VisibilityIcon className="text-[18px]" />
              </IconButton>
              <p className="m-0">{views} </p>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
