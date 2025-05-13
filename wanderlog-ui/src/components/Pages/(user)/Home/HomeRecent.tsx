import { Button, Grid2, Stack } from "@mui/material";
import React from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { RecentCard } from "./_elements";
const HomeRecent: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
    <div className="max-w-[1000px] py-10 w-full">
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 className="text-[1.875rem] font-bold">
          Recently viewed and upcoming
        </h1>
        <div>
          <Button
            startIcon={<PlaylistAddIcon />}
            variant="contained"
            className="bg-[#2e2e2e]"
          >
            Plan new trip
          </Button>
        </div>
      </Stack>
      <div className="my-2">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="p-0 text-[#181818] hover:underline underline-offset-4"
          variant="text"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
        >
          Recently viewed
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Recently viewed</MenuItem>
          <MenuItem onClick={handleClose}>Upcoming</MenuItem>
        </Menu>
      </div>
      <Grid2 container spacing={2}>
        {!!fakeData.length &&
          fakeData?.map((item, index) => (
            <Grid2 size={4} key={index}>
              <RecentCard
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

export default HomeRecent;
