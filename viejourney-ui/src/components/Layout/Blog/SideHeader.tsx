import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IBlogDetail } from "../../../utils/interfaces/blog";
import BlogAppBar from "./BlogAppBar";
import RelatedBlog from "./RelatedBlog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useUserBlog } from "../../../services/stores/useBlogStore";
import Comment from "./Comment";
const SideHeader: React.FC<{ id: string }> = ({ id }) => {
  const [blog, setBlog] = useState<IBlogDetail>();
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const {
    handleGetBlogUserDetail,
    handleCreateFlag,
    handleCheckIsLike,
    handleUnlikeBlog,
    handleLikeBlog,
  } = useUserBlog();
  useEffect(() => {
    (async () => {
      const data = await handleGetBlogUserDetail(id);
      if (data) {
        setBlog(data);
      }

      const liked = await handleCheckIsLike(id);
      setIsLiked(!!liked);
    })();
  }, [id]);

  const handleFlagClick = () => {
    setFlagDialogOpen(true);
  };

  const handleFlagDialogClose = () => {
    setFlagDialogOpen(false);
    setFlagReason("");
  };

  const handleFlagSubmit = async () => {
    if (flagReason.trim() && id) {
      await handleCreateFlag(id, flagReason.trim());
      handleFlagDialogClose();
    }
  };

  const handleToggleLike = async () => {
    try {
      if (isLiked) {
        await handleUnlikeBlog(id);
        setIsLiked(false);
      } else {
        await handleLikeBlog(id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Toggle like error:", error);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="mt-0 py-0 h-full relative shadow-lg">
      <BlogAppBar />
      <div className="relative">
        <img
          src={
            blog?.coverImage ||
            "https://upload.wikimedia.org/wikipedia/commons/1/1e/San_Francisco_from_the_Marin_Headlands_in_March_2019.jpg"
          }
          alt="blog-image"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <Link
          to="/blogs"
          className="text-white absolute top-4 left-4 text-4xl cursor-pointer z-10"
        >
          <ArrowBackIosNewIcon />
        </Link>
        <p className="text-white text-4xl font-bold absolute bottom-6 left-6 z-10">
          {blog?.title}
        </p>
      </div>
      <div className="p-5">
        <div className="general-box flex gap-2 p-3">
          <div className="user-info flex gap-5">
            <img
              src={
                typeof blog?.createdBy?.avatar === "string"
                  ? blog.createdBy?.avatar
                  : blog?.createdBy?.avatar?.url ||
                    "https://tse4.mm.bing.net/th/id/OIP.BD-U5ovS6kKkW0480Yzl5gHaFf?rs=1&pid=ImgDetMain"
              }
              alt="avatar-image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="">
              <p>{blog?.createdBy?.fullName}</p>
              <p className="text-gray-400 text-[14px]">
                {dayjs(blog?.createdAt).format("YYYY-MM-DD")}
              </p>
            </div>
          </div>
          <div className="buttons ml-auto text-md flex gap-2 items-center">
            <div className="btn-follow bg-[#1565C0] font-bold text-white px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-[#1565C0]/80 transition-all duration-300">
              Follow
            </div>

            {isLiked ? (
              <FavoriteIcon
                onClick={handleToggleLike}
                className="cursor-pointer hover:scale-110 transition-all duration-300"
                sx={{ color: "red" }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={handleToggleLike}
                className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600"
              />
            )}

            <IconButton onClick={handleFlagClick}>
              <EmojiFlagsIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
            </IconButton>
            <ShareIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
          </div>
        </div>
        <div className="flex text-[15px] text-gray-500 p-3">
          {blog?.summary}
        </div>

        <Dialog
          open={flagDialogOpen}
          onClose={handleFlagDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Report Blog</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for reporting"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Please provide a reason for reporting this blog..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFlagDialogClose}>Cancel</Button>
            <Button
              onClick={handleFlagSubmit}
              variant="contained"
              disabled={!flagReason.trim()}
            >
              Report
            </Button>
          </DialogActions>
        </Dialog>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
        />
        {/* <Content />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        */}

        <Comment id={id} />
      </div>
      <RelatedBlog />
    </div>
  );
};

export default SideHeader;
