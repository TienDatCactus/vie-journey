import { Chip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserBlog } from "../../../../../services/stores/useBlogStore";
import { IRelatedBlogs } from "../../../../../utils/interfaces/blog";

const ExploreCard: React.FC<{ item: IRelatedBlogs }> = ({ item }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/blogs/${item._id}`);
  };
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { handleCheckIsLike } = useUserBlog();

  useEffect(() => {
    (async () => {
      const liked = await handleCheckIsLike(item._id);
      setIsLiked(!!liked);
    })();
  }, [item._id]);
  console.log("ExploreCard", item);
  return (
    <Card elevation={0} className="lg:w-full shadow-sm">
      <CardActionArea onClick={handleCardClick}>
        <div className="relative z-20">
          <Chip
            className="absolute top-2 left-2 z-10 bg-gray-50"
            label={item?.tags[0]}
          />
          <CardMedia
            component="img"
            className="lg:h-50 w-full object-cover z-0"
            image={
              item?.coverImage ||
              `https://placehold.co/600x400/1a1a1a/ffffff?text=${item?.title
                ?.split(" ")
                ?.join("+")}`
            }
            alt="green iguana"
          />
        </div>
        <CardContent className="p-2 pb-0">
          <Typography gutterBottom variant="h5" className="text-xl ">
            {item.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExploreCard;
