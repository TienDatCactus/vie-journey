import { Button, ButtonGroup, Grid2 } from "@mui/material";
import React from "react";
import join from "/images/join.jpg";
const HomeCatCall: React.FC = () => {
  return (
    <Grid2
      container
      alignItems={"center"}
      spacing={2}
      sx={{
        paddingBottom: "40px",
      }}
    >
      <Grid2 size={4}>
        <img
          src={join}
          alt="join us in VieJourney v0 beta"
          className=" rounded-2xl max-h-[400px] w-full object-cover"
        />
      </Grid2>
      <Grid2 size={8}>
        <h1 className="my-0">Join VieJourney </h1>
        <p className="my-0 text-[#6e6e6e]">
          Plan your itinerary, find lodging, and import reservations — all in
          one app.
        </p>
        <ButtonGroup className="py-4">
          <Button variant={"contained"}>Sign Up</Button>
          <Button variant={"outlined"}>Learn More</Button>
        </ButtonGroup>
      </Grid2>
    </Grid2>
  );
};

export default HomeCatCall;
