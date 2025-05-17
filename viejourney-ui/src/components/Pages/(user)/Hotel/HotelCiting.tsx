import { Container, Grid2, Stack } from "@mui/material";
import React from "react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ht from "/images/pexels-quark-studio-1159039-2507010.jpg";
const HotelCiting: React.FC = () => {
  const fakeData = [
    {
      cite: "A comfortable place to stay, minimalist and clean design makes it more comfortable. Complete facilities are also of high quality.",
      author: " Angelia Surminah",
    },
    {
      cite: "A comfortable place to stay, minimalist and clean design makes it more comfortable. Complete facilities are also of high quality.",
      author: " Angelia Surminah",
    },
    {
      cite: "A comfortable place to stay, minimalist and clean design makes it more comfortable. Complete facilities are also of high quality.",
      author: " Angelia Surminah",
    },
  ];
  return (
    <div className="bg-[#fafafa] w-full py-10">
      <Container>
        <Grid2 container flexDirection={"row"} justifyContent={"space-between"}>
          <Grid2 size={5}>
            <h1 className=" text-[#5f5f5f]">WHAT THEY SAID</h1>
            <Swiper
              scrollbar={{
                hide: true,
              }}
              modules={[Scrollbar]}
              className="mySwiper w-full [&_.swiper-scrollbar-drag]:bg-[#b09d6e] [&_.swiper-scrollbar-drag]:rounded-none "
            >
              {!!fakeData?.length &&
                fakeData?.map((data, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Stack
                        flexDirection={"column"}
                        className="h-full"
                        justifyContent={"space-around"}
                      >
                        <p className="text-[1.25rem]  my-4 font-medium text-[#000]">
                          "{data.cite}"
                        </p>
                        <h1 className="text-[#000] text-[16px] font-semibold">
                          <i>-{data.author} -</i>
                        </h1>
                      </Stack>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </Grid2>
          <Grid2 size={6}>
            <img
              className=" w-full h-full object-cover"
              loading="lazy"
              src={ht}
            />
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
};

export default HotelCiting;
