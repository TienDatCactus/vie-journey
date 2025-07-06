import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, IconButton, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { IBlog } from "../../../../../utils/interfaces/blog";

const GuideCard = (props: IBlog) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/blogs/${props._id}`); // 🔗 Điều hướng tới trang chi tiết
  };

  return (
    <Card sx={{ maxWidth: 345 }} elevation={0} key={props._id} className="">
      <div className="overflow-hidden ">
        <CardMedia
          component="img"
          image={props.coverImage || "https://placehold.co/600x400"}
          alt="green iguana"
          className="duration-200 ease-in-out  hover:scale-115 cursor-pointer  transition-all"
          onClick={handleNavigate}
        />
      </div>
      <CardContent className="p-2">
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="my-0 truncate"
          onClick={handleNavigate}
        >
          {props.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          className="truncate"
        >
          {props.summary}
        </Typography>
        <Stack className="mt-2" direction={"row"} alignItems={"center"} gap={1}>
          <Avatar className="w-[30px] h-[30px] text-[12px]">J</Avatar>
          <h5 className="truncate">{props.author.name}</h5>
          <Stack direction={"row"} gap={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <FavoriteBorderIcon className="text-[18px]" />
              </IconButton>
              <p className="m-0">{props.metrics.likeCount} </p>
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <VisibilityIcon className="text-[18px]" />
              </IconButton>
              <p className="m-0">{props.metrics.viewCount} </p>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GuideCard;
