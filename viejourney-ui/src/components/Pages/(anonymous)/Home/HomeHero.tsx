import React from "react";
import bg from "/images/banner.jpg";
import { Button, ButtonGroup, Stack } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
const HomeHero: React.FC = () => {
  return (
    <div className="w-full">
      <img
        src={bg}
        alt="banner"
        className="w-full h-[400px] object-cover object-center"
      />
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        className="absolute w-full px-8 text-white translate-y-1/2 lg:top-0 md:top-0 sm:top-0"
      >
        <div>
          <h1 className="text-[40px] leading-[50px] font-bold my-2">
            A travel planner for everyone
          </h1>
          <p className="w-1/2 text-[20px] leading-[30px] tracking-tighter my-2 text-[#c4c4c4]">
            Organize flights & hotels and map your trips in a free travel app
            designed for vacation planning & road trips, powered by AI and
            Google Maps.
          </p>
        </div>
        <ButtonGroup className="*:rounded-full gap-2 flex flex-col  *:border *:border-solid *:border-[#ccc] *:p-2 ">
          <Button key="one" color="inherit">
            <InstagramIcon className="text-[22px]" />
          </Button>
          <Button key="two" color="inherit">
            <XIcon className="text-[22px]" />
          </Button>
          <Button key="three" color="inherit">
            <YouTubeIcon className="text-[22px]" />
          </Button>
        </ButtonGroup>
      </Stack>
    </div>
  );
};

export default HomeHero;
