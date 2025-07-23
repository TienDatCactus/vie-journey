import { FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../../../../../services/stores/useBlogStore";
import { IRelatedBlogs } from "../../../../../utils/interfaces/blog";

const BlogCard = (props: IRelatedBlogs) => {
  const navigate = useNavigate();

  const { checkLikeStatus, isLiked } = useBlogStore();

  useEffect(() => {
    (async () => {
      await checkLikeStatus(props?._id);
    })();
  }, [props?._id]);

  const handleNavigate = () => {
    navigate(`/blogs/${props._id}`);
  };

  return (
    <Card
      elevation={0}
      key={props?._id}
      className="border border-dashed h-90 w-auto flex flex-col border-neutral-300 hover:border-neutral-500 transition-all"
    >
      <div className="overflow-hidden ">
        <CardMedia
          component="img"
          image={props?.coverImage || "https://placehold.co/600x400"}
          alt={props?.title}
          className="duration-200 ease-in-out lg:h-60  hover:scale-105 cursor-pointer  transition-all"
          onClick={handleNavigate}
        />
      </div>
      <CardContent className=" flex-1 flex flex-col justify-between p-2">
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="my-0 truncate"
          onClick={handleNavigate}
        >
          {props?.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          className="truncate"
        >
          {props?.summary || "No summary available."}
        </Typography>
        <Stack className="mt-2" direction={"row"} alignItems={"center"} gap={1}>
          <Avatar className="w-[30px] h-[30px] text-[12px]">J</Avatar>
          <h5 className="truncate">{props?.author.name}</h5>
          <Stack direction={"row"} gap={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                {isLiked ? (
                  <FavoriteOutlined
                    className="cursor-pointer hover:scale-110 transition-all duration-300 text-base"
                    sx={{ color: "red" }}
                  />
                ) : (
                  <FavoriteBorder className="text-base" />
                )}
              </IconButton>
              <p className="m-0">{props?.metrics.likeCount} </p>
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <VisibilityIcon className="text-base" />
              </IconButton>
              <p className="m-0">{props?.metrics.viewCount} </p>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
