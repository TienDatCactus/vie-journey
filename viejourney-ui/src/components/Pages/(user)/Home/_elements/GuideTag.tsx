import { MoreHoriz } from "@mui/icons-material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CardActionArea, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
interface GuideTagProps {
  img: string;
  title: string;
  likes: number;
  views: number;
}

const GuideTag = ({ img, title, likes, views }: GuideTagProps) => {
  return (
    <Card className="w-full">
      <div className="p-2">
        <CardMedia
          component="img"
          className="h-full w-full rounded-md"
          image={
            img ||
            `https://placehold.co/600x400/1a1a1a/ffffff?text=${title
              .split(" ")
              .join("+")}`
          }
        />
        <CardContent className="py-2 px-0">
          <div>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="text-[1.125rem] my-1"
            >
              {title}
            </Typography>
            <Stack
              spacing={1}
              alignItems={"center"}
              direction={"row"}
              className="text-[#7d7d7d]"
            >
              <Stack direction={"row"} alignItems={"center"}>
                <IconButton className="p-1">
                  <FavoriteBorderIcon className="text-[18px] " />
                </IconButton>
                <p className="m-0 text-[0.75rem]">{likes}</p>
              </Stack>
              <Stack direction={"row"} alignItems={"center"}>
                <IconButton className="p-1">
                  <VisibilityIcon className="text-[18px]" />
                </IconButton>
                <p className="m-0 text-[0.75rem]">{views}</p>
              </Stack>
            </Stack>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default GuideTag;
