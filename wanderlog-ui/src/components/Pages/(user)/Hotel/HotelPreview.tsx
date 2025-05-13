import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, ImageList, ImageListItem, Stack } from "@mui/material";
import React from "react";
import ht1 from "../../../../assets/images/pexels-julieaagaard-2467285.jpg";
import ht4 from "../../../../assets/images/pexels-jvdm-1457842.jpg";
import ht3 from "../../../../assets/images/pexels-pixabay-271618.jpg";
import ht2 from "../../../../assets/images/pexels-pixabay-271624.jpg";
const HotelPreview: React.FC = () => {
  return (
    <Stack direction={"column"} className="mt-32 px-20 min-h-[100px]">
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        className="h-full"
      >
        <div>
          <h1 className="font-semibold text-[2.5rem]">
            Enjoy an unforgettable stay with the best charm
          </h1>
        </div>
        <Stack
          className="h-full"
          direction={"column"}
          alignItems={"start"}
          gap={2}
        >
          <p className="text-[#5e5e5e]">
            It is a long established fact that a reader will be distracted by
            the readable content of a page
          </p>
          <Button
            className="p-0 text-[#141414] bg-transparent hover:underline  "
            endIcon={<ArrowOutwardIcon />}
          >
            More Info
          </Button>
        </Stack>
      </Stack>
      <div className="my-20">
        <ImageList
          className="w-full min-h-[600px]"
          variant="quilted"
          cols={3}
          rowHeight={200}
        >
          {itemData.map((item) => (
            <ImageListItem
              key={item.img}
              cols={item.cols || 1}
              rows={item.rows || 1}
            >
              <img
                src={
                  item?.img ||
                  `https://placehold.co/600x400/1a1a1a/ffffff?text=${item?.title
                    .split(" ")
                    .join("+")}`
                }
                alt={item?.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </Stack>
  );
};
const itemData = [
  {
    img: ht1,
    title: "Breakfast",
    rows: 4,
    cols: 1, // Left column
  },
  {
    img: ht2,
    title: "Burger",
    rows: 2,
    cols: 1, // Stacks in middle column (top)
  },

  {
    img: ht4,
    title: "Coffee",
    rows: 4,
    cols: 1, // Right column
  },
  {
    img: ht3,
    title: "Camera",
    rows: 2,
    cols: 1, // Stacks in middle column (bottom)
  },
];

export default HotelPreview;
