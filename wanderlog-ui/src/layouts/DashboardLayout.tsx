import { Grid2 } from "@mui/material";
import React from "react";
import Sider from "../components/Layout/Dashboard/Sider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid2
      container
      sx={{ width: "100%", maxWidth: "1000px", maxHeight: "100vh" }}
      p={"30px 0"}
      gap={2}
    >
      <Grid2 size={3}>
        <Sider />
      </Grid2>
      <Grid2 size={8}>{children}</Grid2>
    </Grid2>
  );
};

export default DashboardLayout;
