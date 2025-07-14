import { ArrowForward } from "@mui/icons-material";
import { Button, Grid2, Stack } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import { RecentCard } from "./elements";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const HomeRecent: React.FC = () => {
  const { trips } = useTripDetailStore();
  const navigate = useNavigate();
  return (
    <div className="max-w-[1200px] py-10 w-full">
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        className="mb-4"
      >
        <h1 className="text-2xl font-semibold">Current & Upcoming</h1>
        <div>
          <Button
            variant="contained"
            className="rounded-sm bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black"
            onClick={() => navigate("/profile")}
            endIcon={<ArrowForward />}
          >
            See all
          </Button>
        </div>
      </Stack>

      {!!trips && trips?.length > 0 && (
        <Grid2 container spacing={2}>
          {trips.slice(0, 2).map((item, index) => (
            <Grid2 size={trips.length > 1 ? 4 : 6} key={index}>
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
          <Grid2 size={trips.length > 1 ? 4 : 6}>
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
            </Link>
            <span>a new trip!</span>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

export default HomeRecent;
