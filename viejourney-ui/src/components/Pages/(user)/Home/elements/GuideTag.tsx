import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
interface GuideTagProps {
  img: string;
  title: string;
  likes: number;
  views: number;
}

const GuideTag = ({ img, title, likes, views }: GuideTagProps) => {
  return (
    <Card className="w-full">
      <div className="p-2 ">
        <div className="relative  w-full overflow-hidden">
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
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="text-[1.125rem] my-1 absolute bottom-2 left-2 text-white"
          >
            {title}
          </Typography>
        </div>
        <CardContent className="pb-2 px-0">
          <Stack
            spacing={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
            className="text-[#7d7d7d]"
          >
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton className="p-1">
                <FavoriteBorderIcon className="text-base " />
              </IconButton>
              <p className="m-0 text-sm">{likes}</p>
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton className="p-1">
                <VisibilityIcon className="text-base" />
              </IconButton>
              <p className="m-0 text-sm">{views}</p>
            </Stack>
          </Stack>
        </CardContent>
      </div>
    </Card>
  );
};

export default GuideTag;
