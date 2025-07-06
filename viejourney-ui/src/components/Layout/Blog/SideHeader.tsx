"use client";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import useBlogUser from "../../../utils/hooks/user-blog-user";
import { IBlogDetail } from "../../../utils/interfaces/blog";
import BlogAppBar from "./BlogAppBar";
import RelatedBlog from "./RelatedBlog";

const SideHeader: React.FC<{ id: string }> = ({ id }) => {
  const [blog, setBlog] = useState<IBlogDetail>();
  const { handleGetBlogUserDetail } = useBlogUser();

  const fetchBlog = async () => {
    const res = await handleGetBlogUserDetail(id);
    if (res) setBlog(res);
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  return (
    <div className="mt-0 py-0 relative shadow-lg">
      <BlogAppBar />
      <div className="relative">
        <img
          src={
            blog?.coverImage ||
            "https://upload.wikimedia.org/wikipedia/commons/1/1e/San_Francisco_from_the_Marin_Headlands_in_March_2019.jpg"
          }
          alt="blog-image"
          className="w-full h-auto "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <TravelExploreIcon className="text-white absolute top-4 left-4 text-4xl cursor-pointer z-10" />
        <p className="text-white text-4xl font-bold absolute bottom-6 left-6 z-10">
          {blog?.title}
        </p>
      </div>
      <div className="p-5">
        <div className="general-box flex gap-2 p-3">
          <div className="user-info flex gap-5">
            <img
              src={
                typeof blog?.createdBy.avatar === "string"
                  ? blog.createdBy.avatar
                  : blog?.createdBy.avatar?.url ||
                    "https://tse4.mm.bing.net/th/id/OIP.BD-U5ovS6kKkW0480Yzl5gHaFf?rs=1&pid=ImgDetMain"
              }
              alt="avatar-image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="">
              <p>{blog?.createdBy.fullName}</p>
              <p className="text-gray-400 text-[14px]">
                {dayjs(blog?.createdAt).format("YYYY-MM-DD")}
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
          {blog?.summary}
        </div>

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
        <Comment /> */}
      </div>
      <RelatedBlog />
    </div>
  );
};

export default SideHeader;
