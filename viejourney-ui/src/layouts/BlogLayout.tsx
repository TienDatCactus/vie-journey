import { Grid2 } from "@mui/material";
import React from "react";
import SideHeader from "../components/Layout/Blog/SideHeader";
import Map from "../components/Layout/Blog/Map";

const BlogLayout = () => {
  return (
    <Grid2
      container
      sx={{
        width: "100%",
        maxWidth: "1000px",
        maxHeight: "100vh",
        flexWrap: "nowrap",
      }}
      p={"0px 0"}
      spacing={1}
    >
      <Grid2 size={9}>
        <SideHeader />
      </Grid2>
      <Grid2 size={3}>
        <Map />
      </Grid2>
    </Grid2>
  );
};

export default BlogLayout;
