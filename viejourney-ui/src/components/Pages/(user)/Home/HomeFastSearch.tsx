import AddIcon from "@mui/icons-material/Add";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Button,
  Grid2,
  IconButton,
  InputLabel,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { getPlaces } from "../../../../services/api/customs";
const HomeFastSearch: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [query, setQuery] = useState("");
  const [opts, setOpts] = useState([]);
  const [adults, setAdults] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [rooms, setRooms] = useState(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const autocomplete = async () => {
    const resp = await getPlaces(query);
    console.log(resp);
    setOpts(resp);
  };

  return (
    <div className="w-full max-w-[1000px] py-10">
      <h1 className="my-0 text-[1.875rem] font-bold">
        Find your loving places
      </h1>
      <Stack
        direction={"row"}
        alignItems={"center"}
        className="mt-10"
        spacing={2}
      >
        <Autocomplete
          disablePortal
          sx={{ width: 300 }}
          options={[
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
          ]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Checkin"
              variant="standard"
              onChange={handleChange}
            />
          )}
        />
        <Grid2 container direction={"row"} alignItems={"center"} spacing={2}>
          <Grid2 size={6}>
            <DatePicker label="from" />
          </Grid2>
          <Grid2 size={6}>
            <DatePicker label="to" />
          </Grid2>
        </Grid2>
        <div>
          <Button
            aria-describedby={id}
            variant="outlined"
            onClick={handleClick}
            className="text-[black] border-[#b2b2b2]"
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              className="my-2"
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <ReduceCapacityIcon />
                <span>:</span>
                <p className="my-0">{adults + childrens}</p>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <HotelIcon />
                <span>:</span>
                <p className="my-0">{rooms}</p>
              </Stack>
            </Stack>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack direction={"column"} spacing={2} className="p-4">
              <InputLabel
                component={"h1"}
                className="my-0 text-black text-[18px]"
              >
                Rooms and guests
              </InputLabel>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <HotelIcon />
                <p className="my-0 text-sm">Rooms</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setRooms(rooms - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{rooms}</Typography>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setRooms(rooms + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <PersonIcon />
                <p className="my-0 text-sm">Adults</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setAdults(adults - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{adults}</Typography>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setAdults(adults + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <ChildCareIcon />
                <p className="my-0 text-sm">Childrens</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setChildrens(childrens - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{childrens}</Typography>
                  <IconButton
                    className="bg-[#f5f5f5]"
                    onClick={() => setChildrens(childrens + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Popover>
        </div>
        <IconButton
          className="border border-[#ccc] p-2 shadow-none"
          popover="auto"
        >
          <SearchIcon fontSize="medium" className="text-[#000]" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default HomeFastSearch;
