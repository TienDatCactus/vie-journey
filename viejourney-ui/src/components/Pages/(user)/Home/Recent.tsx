import { Grid2, Stack } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import { getTripList } from "../../../../services/api/trip";
import { ITrip } from "../../../../utils/interfaces/trip";
import { RecentCard } from "./elements";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const HomeRecent: React.FC = () => {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const [trips, setTrips] = useState<ITrip[]>([]);
  useEffect(() => {
    const fetchTrip = async () => {
      const res = await getTripList();
      if (res) {
        const today = dayjs().startOf("day");
        const sevenDaysAgo = today.subtract(7, "day");

        const filtered = res.filter((trip) => {
          const tripStart = dayjs(trip.startDate).startOf("day");
          return (
            tripStart.isSameOrAfter(sevenDaysAgo) &&
            tripStart.isSameOrBefore(today)
          );
        });

        // Lấy tối đa 2 chuyến đi thỏa điều kiện
        setTrips(filtered.slice(0, 2));
      }
    };

    fetchTrip();
  }, []);

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

      <Grid2 container spacing={2}>
        {trips.map((item, index) => (
          <Grid2 size={4} key={index}>
            <RecentCard
              img={""}
              places={item?.destination.location.lat}
              from={item?.startDate}
              title={item?.title}
              to={item?.endDate}
            />
          </Grid2>
        ))}
        <Grid2 size={trips.length > 0 ? 4 : 12}>
          <Stack
            alignItems="center"
            justifyContent="center"
            height="200px"
            width="100%"
          >
            <RecentCard blank={true} />
          </Stack>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HomeRecent;
