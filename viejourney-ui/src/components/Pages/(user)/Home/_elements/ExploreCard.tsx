import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, Divider, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
interface ExploreCardProps {
  img: string;
  title: string;
  description: string;
  author: string;
  liked: number;
  views: number;
}

const ExploreCard = ({
  img,
  title,
  description,
  author,
  liked,
  views,
}: ExploreCardProps) => {
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            img ||
            `https://placehold.co/600x400/1a1a1a/ffffff?text=${title
              .split(" ")
              .join("+")}`
          }
          alt="green iguana"
        />
        <CardContent className="p-0">
          <div className="p-2">
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          </div>
          <Divider className="border-[#ccc]" />
          <Stack
            className="p-2"
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Avatar sx={{ bgcolor: randomColor(), width: 34, height: 34 }}>
                {author.split("")[0]}
              </Avatar>
              <Typography variant="body2">{author}</Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Stack direction={"row"} gap={1}>
                <FavoriteBorderIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {liked}
                </Typography>
              </Stack>

              <Stack direction={"row"} gap={1}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {views}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExploreCard;
