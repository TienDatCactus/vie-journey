import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IBlog } from "../../../../../utils/interfaces/blog";

const BlogTag = ({ blog }: { blog: IBlog }) => {
  return (
    <Card className="w-full">
      <div className="p-2 ">
        <div className="relative  w-full overflow-hidden">
          <CardMedia
            component="img"
            className="h-[168px] w-full rounded-md"
            image={
              blog?.coverImage ||
              `https://placehold.co/600x400/1a1a1a/ffffff?text=${blog?.title
                .split(" ")
                .join("+")}`
            }
          />
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="text-base  my-1 absolute bottom-2 left-2 text-gray-200  truncate"
          >
            {blog?.summary}
          </Typography>
        </div>
        <CardContent className="pb-2 pt-1 px-0">
          <h1 className="text-lg ">{blog?.title}</h1>
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
              <p className="m-0 text-sm">{blog?.metrics?.likeCount}</p>
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton className="p-1">
                <VisibilityIcon className="text-base" />
              </IconButton>
              <p className="m-0 text-sm">{blog?.metrics?.viewCount}</p>
            </Stack>
          </Stack>
        </CardContent>
      </div>
    </Card>
  );
};

export default BlogTag;
