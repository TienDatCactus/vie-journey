import {
  Button,
  Divider,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import hotelHeroBg from "/images/pexels-quark-studio-1159039-2507010.jpg";
const HotelHero: React.FC = () => {
  return (
    <div className="relative w-full overflow-visible bg-cover bg-[50%] bg-no-repeat">
      <img
        src={hotelHeroBg}
        alt="Hotel Hero"
        className="w-full h-[600px] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[#3a3a3a] bg-fixed opacity-50"></div>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] *:text-[#e5e5e5] w-[80%]">
        <h1 className="text-center font-bold text-[3.75rem] my-2">
          Helping You Find The Most Comfortable Place
        </h1>
        <p className="text-center w-1/2 mx-auto">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
      </div>
      <div className=" absolute -bottom-10  left-[50%] translate-x-[-50%]   min-w-[1000px] bg-white shadow-md rounded-md flex items-center justify-between p-4 ">
        <div className="flex flex-col justify-center">
          <label id="demo-multiple-name-label ">Room Type</label>
          <Select
            defaultValue={"placeholder"}
            className="mt-2"
            input={<OutlinedInput label="Name" />}
          >
            <MenuItem disabled value="placeholder">
              <em>Select type</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex flex-col justify-center">
          <label id="demo-multiple-name-label">Checkin</label>
          <DateTimePicker
            className="mt-2"
            defaultValue={dayjs()}
            format={dayjs().format("YYYY-MM-DD")}
          />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex flex-col justify-center">
          <label id="demo-multiple-name-label">Checkout</label>
          <DateTimePicker
            className="mt-2"
            defaultValue={dayjs()}
            format={dayjs().format("YYYY-MM-DD")}
          />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex flex-col justify-center">
          <label id="demo-multiple-name-label">Amount of rooms</label>
          <OutlinedInput
            className="mt-2"
            id="outlined-amount"
            type="number"
            label="Amount of rooms"
            inputProps={{ min: 1, max: 100 }}
          />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div>
          <Button className="bg-black text-white px-6 py-4 rounded-sm">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelHero;
