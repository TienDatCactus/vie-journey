import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect } from "react";
import { useBlogStore } from "../../../../../services/stores/useBlogStore";
import { IBlog } from "../../../../../utils/interfaces/blog";
import { Link } from "react-router-dom";
dayjs.extend(relativeTime);

const BlogTag = ({ blog }: { blog: IBlog }) => {
  const { checkLikeStatus, isLiked } = useBlogStore();

  useEffect(() => {
    (async () => {
      await checkLikeStatus(blog._id);
    })();
  }, [blog._id]);

  return (
    <Card
      className="w-full bg-neutral-50 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
      elevation={0}
    >
      <Link to={`/blogs/${blog._id}`} className="no-underline text-inherit">
        <div className="p-2 pb-0">
          <CardContent className="pb-2 pt-1 space-y-2 px-0">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">{blog?.title}</h1>
              <p className="text-base text-gray-700 truncate">
                {blog?.summary}
              </p>
            </div>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <div>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(blog?.createdAt).fromNow()}
                </Typography>
              </div>
              <Stack
                spacing={1}
                alignItems={"center"}
                justifyContent={"space-between"}
                direction={"row"}
                className="text-gray-500"
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
      </Link>
    </Card>
  );
};

export default BlogTag;
