import SearchIcon from "@mui/icons-material/Search";
import { Chip, InputAdornment, Stack, TextField } from "@mui/material";
import { animate, motion } from "motion/react";
import React, { useRef } from "react";
import { MainLayout } from "../../../layouts";
import { AllGuides } from "../../../components/Pages/(user)/Guides";
const Guides: React.FC = () => {
  const handleScroll = () => {
    const element = destRef.current;
    if (element) {
      animate(window.scrollY, element.offsetTop, {
        duration: 1,
        ease: "easeInOut",
        onUpdate: (value: number) => window.scrollTo(0, value),
      });
    }
  };
  const destinations = [
    "Hanoi",
    "Ho Chi Minh City",
    "Da Nang",
    "Hoi An",
    "Hue",
    "Nha Trang",
    "Phu Quoc",
    "Sapa",
    "Ha Long Bay",
    "Can Tho",
    "Da Lat",
    "Vung Tau",
    "Ninh Binh",
    "Quy Nhon",
    "Mui Ne",
    "Phan Thiet",
    "Con Dao",
    "Cat Ba",
    "Bac Ha",
    "Mai Chau",
    "Ba Be Lake",
    "Cao Bang",
    "Dong Hoi",
    "Dong Ha",
    "Pleiku",
    "Buon Ma Thuot",
    "Chau Doc",
    "Rach Gia",
    "Long Xuyen",
    "My Tho",
  ];
  const destRef = useRef<HTMLDivElement | null>(null);
  return (
    <MainLayout>
      <div className="w-full max-w-[1200px] py-6">
        <Stack
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          className=" mx-auto"
        >
          <h1 className="font-bold my-2 text-[40px]">
            Explore Vietnam's travel guides and itineraries
          </h1>
          <TextField
            className="w-2/3 my-2"
            fullWidth
            placeholder="Search for a destination"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <p className="my-2">Or browse our most popular destinations: </p>
          <Stack direction={"row"} className="flex-wrap " gap={2}>
            {!!destinations.length &&
              destinations
                ?.slice(0, 2)
                .map((destination, index) => (
                  <Chip
                    className="font-bold text-[#727272]"
                    key={index}
                    onClick={(e) => console.log(e)}
                    label={destination}
                  />
                ))}
            <Chip
              className="font-bold text-[#727272]"
              label="See more ..."
              onClick={handleScroll}
            />
          </Stack>
        </Stack>
      </div>
      {/* guides cards */}
      <AllGuides />
      <motion.div
        className="w-full max-w-[1200px] pb-10"
        ref={destRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h1 className="my-4 font-bold text-[1.625rem]">
          Or browse our destinations with the most guides
        </h1>
        <Stack direction={"row"} className="flex-wrap" gap={1}>
          {!!destinations.length &&
            destinations?.map((destination, index) => (
              <Chip
                className="font-bold text-[#727272]"
                onClick={(e) => console.log(e)}
                key={index}
                label={destination}
              />
            ))}
        </Stack>
      </motion.div>
    </MainLayout>
  );
};

export default Guides;
