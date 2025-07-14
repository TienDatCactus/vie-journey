import { Alert, Grid2 } from "@mui/material";
import React from "react";
import CardSkeleton from "../../../../utils/handlers/loading/CardSkeleton";
import { IRelatedBlogs } from "../../../../utils/interfaces/blog";
import { ExploreCard } from "./elements";

const HomeExplore: React.FC<{
  blogs?: IRelatedBlogs[];
}> = ({ blogs }) => {
  return (
    <div className="max-w-[75rem] w-full pb-10">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold">Discover New Destinations</h1>
        <h2 className="my-2 text-base text-gray-600">Popular destinations</h2>
      </div>
      {!!blogs && blogs.length > 0 ? (
        <Grid2 container alignItems={"center"} spacing={2}>
          {blogs
            ?.sort((a, b) => b.metrics.viewCount - a.metrics.viewCount)
            .slice(0, 3)
            .map((item, index) => (
              <Grid2 size={4} key={index}>
                <ExploreCard item={item} />
              </Grid2>
            ))}
        </Grid2>
      ) : (
        <div className="relative w-full max-w-[75rem] mx-auto flex flex-col justify-center items-center">
          <div className="inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute  w-full h-full flex justify-center items-center ">
            <Alert severity="error" className=" text-center">
              No blogs currently available
            </Alert>
          </div>
          <div className="w-full max-w-[75rem] mx-auto flex justify-center items-center">
            <CardSkeleton count={3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeExplore;
