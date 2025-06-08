import { Button, Grid2, Stack } from "@mui/material";
import React from "react";
import GuideCard from "./_elements/GuideCard";
const AllGuides: React.FC = () => {
  const fakeGuides: Array<{
    img: string;
    title: string;
    description: string;
    author: string;
    likes: number;
    views: number;
  }> = [
    {
      img: "https://via.placeholder.com/150",
      title: "Guide to the Mountains",
      description: "A comprehensive guide to exploring the mountains.",
      author: "John Doe",
      likes: 120,
      views: 3000,
    },
    {
      img: "https://via.placeholder.com/150",
      title: "City Adventures",
      description: "Discover the hidden gems in the city.",
      author: "Jane Smith",
      likes: 95,
      views: 2500,
    },
    {
      img: "https://via.placeholder.com/150",
      title: "Beach Escapes",
      description: "Find the best beaches for your next vacation.",
      author: "Emily Johnson",
      likes: 150,
      views: 4000,
    },
  ];
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-4 text-[1.25rem] font-bold">Recent guides</h1>
      <Grid2 container spacing={2}>
        {!!fakeGuides.length &&
          fakeGuides?.map((guide, index) => (
            <Grid2 size={3}>
              <GuideCard {...guide} index={index} />
            </Grid2>
          ))}
      </Grid2>
      <Stack direction={"row"} justifyContent={"center"}>
        <Button
          variant="outlined"
          color="primary"
          className="rounded-4xl py-2 px-10 border-[#d9d9d9] text-[#495057] font-semibold"
        >
          See more
        </Button>
      </Stack>
    </div>
  );
};

export default AllGuides;
