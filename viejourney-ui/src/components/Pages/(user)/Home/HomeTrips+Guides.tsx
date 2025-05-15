import { Add } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid2,
  List,
  ListItem,
  Paper,
  Stack,
} from "@mui/material";
import React from "react";
import { GuideTag, TripTag } from "./_elements";
const HomeTrips: React.FC = () => {
  const fakeData1 = [
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
    <div className="w-full max-w-[1000px] pb-10">
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Paper className="flex flex-col justify-between bg-[#f3f4f5] p-4 h-[21.25rem] max-h-[25rem]">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <h1 className="my-0 text-[1.5rem] font-bold">Your trips</h1>
              <div>
                <Button
                  variant="outlined"
                  className="bg-[#dee2e6] border-[#dee2e6] text-[#495057] hover:bg-[#adb5bd] hover:border-[#adb5bd] hover:text-[#212529] rounded-4xl"
                  startIcon={<Add />}
                >
                  Plan new trip
                </Button>
              </div>
            </Stack>
            <Stack className="my-2 mt-4">
              {!!fakeData1.length &&
                fakeData1?.map((item, index) => (
                  <Stack key={index}>
                    <TripTag
                      img={item?.img}
                      title={item?.title}
                      places={item?.places}
                      from={item?.from}
                      to={item?.to}
                    />
                    {index < fakeData1?.length - 1 && (
                      <Divider className="border-[#d9d9d9] border my-4" />
                    )}
                  </Stack>
                ))}
            </Stack>
            <div className="flex justify-end">
              <Button variant="text" className="p-0 hover:underline">
                See all
              </Button>
            </div>
          </Paper>
        </Grid2>
        <Grid2 size={6}>
          <Paper className="bg-[#f3f4f5] p-4  h-[21.25rem] max-h-[400px] overflow-auto">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <h1 className="my-0 text-[1.5rem] font-bold">Your guides</h1>
              <div>
                <Button
                  variant="outlined"
                  className="
                bg-[#dee2e6] border-[#dee2e6] text-[#495057] hover:bg-[#adb5bd] hover:border-[#adb5bd] hover:text-[#212529] rounded-4xl"
                  startIcon={<Add />}
                >
                  Create new guide
                </Button>
              </div>
            </Stack>
            <Grid2 container spacing={2} className="my-2 mt-4">
              {!!fakeData2.length &&
                fakeData2?.map((item, index) => (
                  <Grid2 size={6} key={index}>
                    <GuideTag
                      img={item?.img}
                      title={item?.title}
                      likes={item?.likes}
                      views={item?.views}
                    />
                  </Grid2>
                ))}
            </Grid2>
            <div className="flex justify-end">
              <Button variant="text" className="p-0 hover:underline">
                See all
              </Button>
            </div>
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HomeTrips;
