import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useUserBlog } from "../../../../../services/stores/useUserBlog";
import { IRelatedBlogs } from "../../../../../utils/interfaces/blog";

const BlogTag = ({ blog }: { blog: IRelatedBlogs }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { handleCheckIsLike } = useUserBlog();

  useEffect(() => {
    (async () => {
      const liked = await handleCheckIsLike(blog._id);
      setIsLiked(!!liked);
    })();
  }, [blog._id]);

  return (
    <Card className="w-full bg-neutral-200" elevation={0}>
      <div className="p-2 pb-0">
        <div className="relative  w-full overflow-hidden">
          <CardMedia
            component="img"
            className="h-40 w-full rounded-md"
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
          <Stack direction={"row"} justifyContent={"space-between"}>
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
                  {isLiked ? (
                    <FavoriteIcon
                      className="cursor-pointer text-base hover:scale-110 transition-all duration-300"
                      sx={{ color: "red" }}
                    />
                  ) : (
                    <FavoriteBorderIcon className="cursor-pointer text-base hover:scale-110 transition-all duration-300 text-gray-600" />
                  )}
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
          </Stack>
        </CardContent>
      </div>
    </Card>
  );
};

export default BlogTag;
