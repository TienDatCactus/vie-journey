/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchIcon from "@mui/icons-material/Search";
import { Button, Chip, InputAdornment, Stack, TextField } from "@mui/material";
import { animate, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { AllBlogs } from "../../../components/Pages/(user)/Guides";
import { MainLayout } from "../../../layouts";
import { Link } from "react-router-dom";
import { useUserBlog } from "../../../services/stores/useUserBlog";
import { IBlog } from "../../../utils/interfaces/blog";
const BlogList: React.FC = () => {
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

  const [blogs, setBlogs] = useState<IBlog[]>();
  const [searchQuery, setSearchQuery] = useState("");

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const { getBlogList } = useUserBlog();
  useEffect(() => {
    fetchData(params);
  }, []);

  const fetchData = async (params: any) => {
    const data = await getBlogList(params);
    if (data) {
      setBlogs(data);
    }
  };

  const handleShowMore = () => {
    const newParam = {
      ...params,
      limit: params.limit + 10,
    };

    setParams(newParam);
    fetchData(newParam);
  };

  const handleSearchChange = (search: string) => {
    const newParams = {
      ...params,
      search,
    };
    setParams(newParams);
    fetchData(newParams);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchChange(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  return (
    <MainLayout>
      <div className="w-full max-w-[75rem]  py-6">
        <Stack
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          className=" mx-auto"
          gap={1}
        >
          <h1 className="font-bold my-2 text-[40px]">
            Explore Vietnam's travel guides and itineraries
          </h1>
          <TextField
            className="w-2/3 my-2"
            fullWidth
            variant="standard"
            placeholder="Search for a specific blog"
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
          <Link
            to={"/blogs/create"}
            className="text-gray-500 hover:text-black transition-all duration-400 ease-in-out hover:scale-110"
          >
            Write your own blogs and share your travel experiences with the
            world.
          </Link>
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
      <AllBlogs blogs={blogs ?? []} />
      <div className="flex justify-center mt-6">
        <Button
          variant="outlined"
          onClick={handleShowMore}
          color="primary"
          className="rounded-4xl py-2 px-10 border-[#d9d9d9] text-[#495057] font-semibold"
        >
          See more
        </Button>
      </div>
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

export default BlogList;
