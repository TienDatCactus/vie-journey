import { Grid2 } from "@mui/material";
import React from "react";
import SideHeader from "../components/Layout/Blog/SideHeader";
import Map from "../components/Layout/Blog/Map";

const BlogLayout = () => {
  return (
    <Grid2
      container
      sx={{ width: "100%", maxWidth: "1000px", maxHeight: "100vh" }}
      p={"30px 0"}
      gap={2}
    >
      <Grid2 size={4}>
        <SideHeader />
      </Grid2>
      <Grid2 size={6}>
        <Map />
      </Grid2>
    </Grid2>
  );
};

export default BlogLayout;
