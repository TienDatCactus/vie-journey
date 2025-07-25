import { Chip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { IRelatedBlogs } from "../../../../../utils/interfaces/blog";

const ExploreCard: React.FC<{ item: IRelatedBlogs }> = ({ item }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/blogs/${item._id}`);
  };

  return (
    <Card
      elevation={0}
      className="lg:w-full shadow-sm hover:shadow-md transition-all duration-200"
    >
      <CardActionArea onClick={handleCardClick}>
        <div className="relative z-20">
          <Chip
            className="absolute top-2 left-2 z-10 bg-gray-50"
            label={item?.tags[0] || "General"}
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
            alt={item?.title}
          />
        </div>
        <CardContent className="p-2 pb-0">
          <Typography
            gutterBottom
            variant="h5"
            className="text-lg line-clamp-1"
          >
            {item.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExploreCard;
