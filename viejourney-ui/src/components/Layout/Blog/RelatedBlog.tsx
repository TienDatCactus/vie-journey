import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const RelatedBlog = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const blogs = [
    {
      id: 1,
      title: "Japan Guide in GB&PL",
      author: "Julia Jablonska",
      views: "1345 views",
      likes: "35 likes",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      title: "A 10-Day Japan Winter Itinerary for Families with Young Kids",
      author: "Laura Khairunnisa",
      views: "1672 views",
      likes: "29 likes",
      image:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      title: "Japan Bound! Plan from A to Z",
      author: "Ilse",
      views: "18807 views",
      likes: "760 likes",
      image:
        "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      title: "Tokyo Food Guide: Best Places to Eat",
      author: "Mike Chen",
      views: "2543 views",
      likes: "156 likes",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, blogs.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, blogs.length - 2)) %
        Math.max(1, blogs.length - 2)
    );
  };

  return (
    <div className="w-full p-6 bg-[#E9ECEF] mt-10">
      <h2 className="text-2xl font-bold mb-6">Related guides</h2>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          style={{ marginLeft: "-20px" }}
        >
          <ArrowBackIosIcon fontSize="small" className="text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          style={{ marginRight: "-20px" }}
        >
          <ArrowForwardIosIcon fontSize="small" className="text-gray-600" />
        </button>

        {/* Slider Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex-shrink-0 w-1/3 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {blog.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={blog.avatar}
                      alt={blog.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {blog.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{blog.views}</span>
                    <span>•</span>
                    <span>{blog.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedBlog;
