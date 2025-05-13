import React from "react";
import {
  HomeExplore,
  HomeFastSearch,
  HomeMap,
  HomeRecent,
  HomeTrips,
} from "../../../components/Pages/(user)/Home";
import { MainLayout } from "../../../layouts";
import { Divider } from "@mui/material";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HomeRecent />
      <HomeFastSearch />
      <HomeMap />
      <HomeTrips />
      <HomeExplore />
    </MainLayout>
  );
};

export default Home;
