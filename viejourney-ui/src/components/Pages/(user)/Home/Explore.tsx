import { Grid2 } from "@mui/material";
import React from "react";
import { IBlog } from "../../../../utils/interfaces/blog";
import { ExploreCard } from "./elements";

const HomeExplore: React.FC<{
  blogs?: IBlog[];
}> = ({ blogs }) => {
  return (
    <div className="max-w-[75rem] w-full pb-10">
      <div>
        <h1 className="text-[2.5rem] font-bold">Explore</h1>
        <h2 className="my-4 text-[1.375rem] font-semibold">
          Popular destinations
        </h2>
      </div>
      <Grid2 container alignItems={"center"} spacing={2}>
        {blogs
          ?.sort((a, b) => b.metrics.viewCount - a.metrics.viewCount)
          .slice(0, 3)
          .map((item, index) => (
            <Grid2 size={4} key={index}>
              <ExploreCard
                id={item._id}
                author={item?.author}
                description={item?.summary}
                img={item?.coverImage}
                liked={item?.metrics.likeCount}
                title={item?.title}
                views={item?.metrics.viewCount}
              />
            </Grid2>
          ))}
      </Grid2>
    </div>
  );
};

export default HomeExplore;
