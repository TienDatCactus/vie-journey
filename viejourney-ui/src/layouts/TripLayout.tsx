import React from "react";
// import Header from "../components/Layout/(anonymous)/Header";
import { Grid2 } from "@mui/material";
import { TripHeader, TripSideNavigation } from "../components/Layout";

const TripLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid2 container>
      <Grid2 size={6}>
        <TripHeader />
        <Grid2 container>
          <Grid2 size={"grow"}>
            <TripSideNavigation />
          </Grid2>
          <Grid2 size={10}>{children}</Grid2>
        </Grid2>
      </Grid2>
      <Grid2 size={6}></Grid2>
    </Grid2>
  );
};

export default TripLayout;
