import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IBlog } from "../../../utils/interfaces/blog";
import { useUserBlog } from "../../../services/stores/useUserBlog";

const RelatedBlog = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogs, setBlogs] = useState<IBlog[]>();
  const { getBlogList } = useUserBlog();
  useEffect(() => {
    (async () => {
      const data = await getBlogList();
      if (data) {
        setBlogs(data);
      }
    })();
  }, []);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, (blogs?.length ?? 0) - 2)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, (blogs?.length ?? 0) - 2)) %
        Math.max(1, (blogs?.length ?? 0) - 2)
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
            {blogs?.map((blog) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="flex-shrink-0 w-1/3 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={blog.coverImage}
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
                      src={blog.coverImage}
                      alt={blog.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {blog.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{blog.metrics.viewCount}</span>
                    <span>•</span>
                    <span>{blog.metrics.likeCount}</span>
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
