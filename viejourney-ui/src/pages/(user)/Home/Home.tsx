import React from "react";

import { MainLayout } from "../../../layouts";
import {
  HomeBanner,
  HomeExplore,
  HomeFastSearch,
  HomeMap,
  HomeRecent,
  HomeTrips,
} from "../../../components/Pages/(user)";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HomeBanner />
      <HomeRecent />
      <HomeFastSearch />
      <HomeMap />
      <HomeTrips />
      <HomeExplore />
    </MainLayout>
  );
};

export default Home;
