import { DoubleArrow } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
const HomeCall: React.FC = () => {
  return (
    <div className="w-full lg:h-100 grid lg:grid-cols-2 lg:items-start sm:grid-cols-1 bg-dark-900 px-10 py-20 ">
      <div>
        <h1 className="text-neutral-100 lg:text-6xl">
          Pack your bags, your{" "}
          <span className="text-neutral-700">adventure awaits!</span>
        </h1>
        <Stack direction={"row"} spacing={2} className=" mt-20">
          <Button className="text-neutral-400 border border-neutral-800 rounded-full px-4 ">
            Youtube
          </Button>
          <Button className="text-neutral-400 border border-neutral-800 rounded-full px-4">
            Instagram
          </Button>
          <Button className="text-neutral-400 border border-neutral-800 rounded-full px-4 ">
            Facebook
          </Button>
        </Stack>
      </div>
      <div className="flex justify-end items-start">
        <Link to="/trips/create">
          <Button
            className="bg-neutral-100 px-6 py-4 text-dark-700 font-semibold text-base"
            endIcon={<DoubleArrow />}
          >
            Start your journey
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeCall;
