import { Divider, Grid2, Rating, Stack } from "@mui/material";
import React from "react";
const HotelRating: React.FC = () => {
  return (
    <Grid2
      container
      flexDirection={"row"}
      alignItems={"center"}
      gap={8}
      className="min-h-[300px] px-40 bg-dark-900 w-full text-dark-50"
    >
      <Grid2 size={5} flexDirection={"column"}>
        <h1 className="font-medium text-[30px]">
          Hotels with the best service and quality always
        </h1>
        <Divider flexItem className="border-dark-500 my-4" />
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Rating
            name="simple-uncontrolled"
            className="text-[1.875rem]"
            defaultValue={5}
          />
          <p className="text-dark-300">5.0</p>
        </Stack>
        <p className="text-dark-300">a five-star hotel</p>
      </Grid2>
      <Grid2 size={6} flexDirection={"row"} position={"relative"}>
        <div className="*:text-center border-dark-500 border rounded-full w-[200px] min-h-[200px] flex flex-col justify-center absolute top-1/2 left-15 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-[2.5rem]">100+</h1>
          <p className="text-[0.625rem] text-accent-border">Comfortable room</p>
        </div>
        <div className="*:text-center border-dark-500 border rounded-full w-[200px] min-h-[200px] flex flex-col justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-[2.5rem]">5M+</h1>
          <p className="text-[0.625rem] text-accent-border">Happy Customer</p>
        </div>
        <div className="*:text-center border-dark-500 border rounded-full w-[200px] min-h-[200px] flex flex-col justify-center absolute top-1/2 -right-10  -translate-y-1/2">
          <h1 className="text-[2.5rem]">23+</h1>
          <p className="text-[0.625rem] text-accent-border">
            Certificate of Merit
          </p>
        </div>
      </Grid2>
    </Grid2>
  );
};

export default HotelRating;
