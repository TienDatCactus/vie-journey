import { Button, ButtonGroup, Grid2, Stack } from "@mui/material";
import React from "react";
import { TourCard } from "./_elements";
const HomeTours: React.FC = () => {
  const tours: Array<{
    img: string;
    title: string;
    sub: string;
    author: string;
    views: number;
    liked: number;
  }> = [
    {
      img: "https://via.placeholder.com/150",
      title: "Explore the Alps",
      sub: "A week-long adventure in the Swiss Alps",
      author: "John Doe",
      views: 1234,
      liked: 567,
    },
    {
      img: "https://via.placeholder.com/150",
      title: "Discover Japan",
      sub: "A cultural journey through Japan",
      author: "Jane Smith",
      views: 2345,
      liked: 678,
    },
    {
      img: "https://via.placeholder.com/150",
      title: "Safari in Kenya",
      sub: "Experience the wildlife of Kenya",
      author: "Alice Johnson",
      views: 3456,
      liked: 789,
    },
  ];
  return (
    <div className="max-w-[62.5rem] py-10">
      <div className="w-[80%] mx-auto mb-10">
        <h1 className="text-center my-0 text-6xl font-bold">
          Find your next adventure
        </h1>
        <p className="text-center text-xl my-4 text-neutral-900">
          Browse through itineraries and guides crafted by fellow travelers. Get
          inspired by real experiences and detailed plans for your next
          adventure
        </p>
      </div>
      <Grid2 container spacing={2}>
        {!!tours.length &&
          tours?.map((tour, index) => (
            <Grid2 size={4}>
              <TourCard
                img={tour.img}
                title={tour.title}
                sub={tour.sub}
                author={tour.author}
                views={tour.views}
                liked={tour.liked}
              />
            </Grid2>
          ))}
      </Grid2>
      <Stack className="mt-8" alignItems={"center"}>
        <ButtonGroup>
          <Button href="/trip/create">Start planning</Button>
          <Button>Get the app</Button>
        </ButtonGroup>
      </Stack>
    </div>
  );
};

export default HomeTours;
