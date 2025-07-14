import { Grid2 } from "@mui/material";
import React from "react";
import { IRelatedBlogs } from "../../../../utils/interfaces/blog";
import BlogCard from "./_elements/GuideCard";
const AllBlogs: React.FC<{ blogs: IRelatedBlogs[] }> = ({ blogs }) => {
  return (
    <div className="w-full max-w-[1200px] ">
      <h1 className="mb-4 text-2xl font-bold ">Recent blogs</h1>
      <Grid2 container spacing={2}>
        {!!blogs?.length &&
          blogs?.map((blog) => (
            <Grid2 size={3} key={blog._id}>
              <BlogCard {...blog} />
            </Grid2>
          ))}
      </Grid2>
    </div>
  );
};

export default AllBlogs;
