import { Button, Chip, Grid2 } from "@mui/material";
import React from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GuideCard } from "./_elements";
import cardmedia from "/images/lake-storm-morning-8k-mr.jpg";
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
      <div className="grid grid-cols-12">
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-center items-start gap-4">
          <Chip label="# Our destination" />
          <h2>Your next favorite place awaits</h2>
        </div>
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-center items-start gap-4">
          <p>
            Get the best value for your trips with exclusive discounts, seasonal
            promotions, and deals to save while exploring the world!
          </p>
          <Button className="px-4 py-2 text-black border-2 border-neutral-600 border-solid rounded-full">
            See All
          </Button>
        </div>
      </div>

      <div>
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="w-[80%] shadow-md rounded-2xl mySwiper"
        >
          {!!guideCards?.length &&
            guideCards?.map((guide, index) => (
              <SwiperSlide key={index}>
                <GuideCard
                  title={guide.title}
                  img={guide.img}
                  tags={guide.tags}
                  mins={guide.mins}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeGuides;
