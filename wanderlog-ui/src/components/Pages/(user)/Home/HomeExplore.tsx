import { Grid2 } from "@mui/material";
import React from "react";
import { ExploreCard } from "./_elements";

const HomeExplore: React.FC = () => {
  const fakeData = [
    {
      img: "",
      title: "Beautiful Beach",
      description: "A beautiful beach with crystal clear water.",
      author: "John Doe",
      liked: 120,
      views: 3000,
    },
    {
      img: "",
      title: "Mountain Adventure",
      description: "An exciting mountain adventure awaits.",
      author: "Jane Smith",
      liked: 200,
      views: 5000,
    },
    {
      img: "",
      title: "City Lights",
      description: "Experience the vibrant city life.",
      author: "Alice Johnson",
      liked: 150,
      views: 4000,
    },
  ];
  return (
    <div className="max-w-[1000px] w-full pb-10">
      <div>
        <h1 className="text-[2.5rem] font-bold">Explore</h1>
        <h2 className="my-4 text-[1.375rem] font-semibold">
          Popular destinations
        </h2>
      </div>
      <Grid2 container alignItems={"center"} spacing={2}>
        {!!fakeData.length &&
          fakeData?.map((item, index) => (
            <Grid2 size={4}>
              <ExploreCard
                key={index}
                author={item?.author}
                description={item?.description}
                img={item?.img}
                liked={item?.liked}
                title={item?.title}
                views={item?.views}
              />
            </Grid2>
          ))}
      </Grid2>
    </div>
  );
};

export default HomeExplore;
