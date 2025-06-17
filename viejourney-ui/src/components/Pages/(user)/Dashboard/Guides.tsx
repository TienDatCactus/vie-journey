import { Grid2 } from "@mui/material";
import React from "react";
import { GuideTag } from "../Home/elements";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const DashboardGuides = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const fakeData2 = [
    {
      img: "",
      title: "Exploring London",
      likes: 120,
      views: 3000,
    },
    {
      img: "",
      title: "Adventures in Tokyo",
      likes: 200,
      views: 5000,
    },
  ];
  return (
    <Grid2
      container
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="py-2"
      gap={1}
    >
      {!!fakeData2.length &&
        fakeData2?.map((item, index) => (
          <Grid2 size={4} key={index}>
            <GuideTag
              img={item?.img}
              title={item?.title}
              likes={item?.likes}
              views={item?.views}
            />
          </Grid2>
        ))}
    </Grid2>
  );
};

export default DashboardGuides;
