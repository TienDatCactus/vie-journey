import React from "react";

import { MainLayout } from "../../../layouts";
import {
  HomeBanner,
  HomeExplore,
  HomeMap,
  HomeRecent,
  HomeTrips,
} from "../../../components/Pages/(user)";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HomeBanner />
      <HomeRecent />
      <HomeMap />
      <HomeTrips />
      <HomeExplore />
    </MainLayout>
  );
};

export default Home;
