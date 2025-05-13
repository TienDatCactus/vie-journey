import React from "react";
import { Grid2 } from "@mui/material";
import { PlanCard } from "./_element";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const DashboardPlans = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const fakeData = [
    {
      places: 5,
      title: "Trip to Paris",
      from: "2023-01-01",
      to: "2023-01-10",
      img: "",
    },
    {
      places: 3,
      title: "Weekend in New York",
      from: "2023-02-15",
      to: "2023-02-18",
      img: "",
    },
  ];
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="py-2"
    >
      <Grid2 container spacing={2}>
        {!!fakeData.length &&
          fakeData?.map((item, index) => (
            <Grid2 size={6} key={index}>
              <PlanCard
                img={item?.img}
                places={item?.places}
                from={item?.from}
                title={item?.title}
                to={item?.to}
                key={index}
              />
            </Grid2>
          ))}
      </Grid2>
    </div>
  );
};

export default DashboardPlans;
