import { Grid2, Stack } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React from "react";
import { Link } from "react-router-dom";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import { RecentCard } from "./elements";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const HomeRecent: React.FC = () => {
  const { trips } = useTripDetailStore();

  return (
    <div className="max-w-[1200px] py-10 w-full">
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="mb-4"
      >
        <h1 className="text-[1.875rem] font-bold">
          Recently viewed and upcoming
        </h1>
        <div>
          {/* <ToggleButtonGroup exclusive>
            <ToggleButton value="left">Recently viewed</ToggleButton>
            <ToggleButton value="center">Upcoming</ToggleButton>
          </ToggleButtonGroup> */}
        </div>
      </Stack>

      {!!trips && trips?.length > 0 && (
        <Grid2 container spacing={2}>
          {trips.map((item, index) => (
            <Grid2 size={4} key={index}>
              <RecentCard
                tripId={item?._id}
                img={""}
                place={item?.destination.name}
                from={dayjs(item?.startDate).format("MMM D, YYYY")}
                title={item?.title}
                to={dayjs(item?.endDate).format("MMM D, YYYY")}
              />
            </Grid2>
          ))}
          <Grid2 size={trips.length > 0 ? 4 : 12}>
            <RecentCard blank={true} />
          </Grid2>
        </Grid2>
      )}
      {!!trips && trips?.length == 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          height="200px"
          width="100%"
        >
          <h2 className="text-gray-500">No recent trips found.</h2>
          <Stack
            direction={"row"}
            alignItems={"center"}
            className="text-gray-700 space-x-2 text-3xl "
          >
            <span> Try </span>
            <Link to={"/trips/create"} className="hover:underline">
              creating
            </Link>{" "}
            <span>a new trip!</span>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

export default HomeRecent;
