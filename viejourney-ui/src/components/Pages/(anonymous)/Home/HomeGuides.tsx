import { Button, Chip } from "@mui/material";
import React from "react";
import cardmedia from "/images/lake-storm-morning-8k-mr.jpg";
import { DoubleArrow } from "@mui/icons-material";
const HomeGuides: React.FC = () => {
  const guideCards: Array<{
    title: string;
    img: string;
    tags: string[];
    mins: number;
  }> = [
    {
      title: "Guide to Paris",
      img: cardmedia,
      tags: ["city", "culture"],
      mins: 15,
    },
    {
      title: "Exploring the Alps",
      img: cardmedia,
      tags: ["mountains", "hiking"],
      mins: 20,
    },
    {
      title: "Beach Getaways",
      img: cardmedia,
      tags: ["beach", "relaxation"],
      mins: 10,
    },
  ];

  return (
    <div className="max-w-[1200px] pb-20">
      <div className="grid grid-cols-12 ">
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-center items-start gap-4 py-10">
          <Chip
            label="# Our destination"
            className="bg-white border border-neutral-400"
          />
          <h2 className="font-semibold lg:text-6xl text-3xl">
            Your next favorite place awaits
          </h2>
        </div>
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-evenly items-start gap-4 ">
          <p className="lg:text-lg text-neutral-800">
            Get the best value for your trips with exclusive discounts, seasonal
            promotions, and deals to save while exploring the world!
          </p>
          <Button
            endIcon={<DoubleArrow />}
            className="p-4  text-neutral-100 lg:w-50 justify-between bg-dark-900 border-solid "
          >
            See All
          </Button>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {guideCards.map((card, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 min-h-80 relative border-neutral-300 rounded-lg "
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <h3 className="text-xl absolute lg:bottom-4 lg:left-4  text-white ">
              {card.title}
            </h3>
            <Chip
              label={`${card.mins} Destination`}
              className="absolute top-2 left-2 lg:text-sm bg-white text-black"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeGuides;
