import { DoubleArrow } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React from "react";
import bg from "/images/banner.jpg";
const HomeHero: React.FC = () => {
  return (
    <div className="w-full relative">
      <img
        src={bg}
        alt="banner"
        className="w-full h-[80vh] object-cover object-center"
      />
      <Stack
        direction={"row"}
        alignItems={"end"}
        justifyContent={"space-between"}
        className="absolute w-full px-8 text-white lg:bottom-10"
      >
        <div className="w-2/3">
          <h1 className="lg:text-6xl leading-snug font-semibold my-2">
            Pack your bags, let's go somewhere amazing
          </h1>
          <p className="lg:text-lg lg:w-1/2 leading-snug tracking-wide my-2 ">
            Hidden gems, breathtaking views, unforgettable adventures—where will
            you go next?
          </p>
        </div>
        <Button
          variant="contained"
          className="bg-white text-black lg:text-lg px-4 lg:px-6 lg:py-4 font-semibold shadow-lg  hover:bg-gray-200 transition-colors"
          href="/trips/create"
          endIcon={<DoubleArrow />}
        >
          Plan Now
        </Button>
      </Stack>
    </div>
  );
};

export default HomeHero;
