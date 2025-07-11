import { Grid2 } from "@mui/material";
import React from "react";
import { IBlog } from "../../../../utils/interfaces/blog";
import GuideCard from "./_elements/GuideCard";
const AllBlogs: React.FC <{blogs: IBlog[]}> = ({blogs}) => {
 
  return (
    <div className="w-full max-w-[1200px] ">
      <h1 className="mb-4 text-2xl font-bold ">Recent blogs</h1>
      <Grid2 container spacing={2}>
        {!!blogs?.length &&
          blogs?.map((guide) => (
            <Grid2 size={3} key={guide._id}>
              <GuideCard {...guide} />
            </Grid2>
          ))}
      </Grid2>
    
    </div>
  );
};

export default AllBlogs;
