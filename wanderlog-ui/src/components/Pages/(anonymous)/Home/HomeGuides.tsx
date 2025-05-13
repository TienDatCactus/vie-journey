import { Button, Grid2, Stack } from "@mui/material";
import cardmedia from "../../../../assets/images/lake-storm-morning-8k-mr.jpg";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { GuideCard } from "./_elements";
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
    <div className="max-w-[1000px] pb-10">
      <Grid2 container spacing={4} alignItems={"center"}>
        <Grid2 size={6}>
          <h1 className="text-[60px] my-0">Our traveling guides</h1>
          <div>
            <p className="text-[#6e6e6e]">
              The most exotic island in Europe in the center of the vast blue
              ocean. enveloped by a mild maritime climate and the paradisiacal
              beauty of untouched nature imaginable
            </p>
            <Button className="px-4 py-2 text-black border-2 border-black border-solid rounded-full ">
              Read all guides
            </Button>
          </div>
        </Grid2>
        <Grid2 size={6}>
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
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HomeGuides;
