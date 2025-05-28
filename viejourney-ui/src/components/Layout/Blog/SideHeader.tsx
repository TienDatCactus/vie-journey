import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Content from "./Notes";
import PlaceToVisit from "./PlaceToVisit";
import RelatedBlog from "./RelatedBlog";
import Comment from "./Comment";
import BlogAppBar from "./BlogAppBar";

const SideHeader: React.FC = () => {
  return (
    <div className="mt-0 py-0 relative shadow-lg">
      <BlogAppBar />
      <div className="relative">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/1e/San_Francisco_from_the_Marin_Headlands_in_March_2019.jpg"
          alt="blog-image"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <TravelExploreIcon className="text-white absolute top-4 left-4 text-4xl cursor-pointer z-10" />
        <p className="text-white text-4xl font-bold absolute bottom-6 left-6 z-10">
          San Francisco City Guide
        </p>
      </div>
      <div className="p-5">
        <div className="general-box flex gap-2 p-3">
          <div className="user-info flex gap-5">
            <img
              src="https://tse4.mm.bing.net/th/id/OIP.BD-U5ovS6kKkW0480Yzl5gHaFf?rs=1&pid=ImgDetMain"
              alt="avatar-image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="">
              <p>Marcus Glyptis</p>
              <p className="text-gray-400 text-[14px]">
                26th May 2025 - 606 views
              </p>
            </div>
          </div>
          <div className="buttons ml-auto text-md flex gap-2 items-center">
            <div className="btn-follow bg-[#1565C0] font-bold text-white px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-[#1565C0]/80 transition-all duration-300">
              Follow
            </div>
            <FavoriteBorderIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
            <ChatBubbleOutlineIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
            <ShareIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
          </div>
        </div>
        <div className="flex text-[15px] text-gray-500 p-3">
          Visited PR for 5 days in May 2025, here is my complete travel
          itinerary
        </div>
        <Content />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        <PlaceToVisit />
        <Comment />
      </div>
      <RelatedBlog />
    </div>
  );
};

export default SideHeader;
