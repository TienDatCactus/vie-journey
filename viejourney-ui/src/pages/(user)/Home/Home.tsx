import React from "react";

import { MainLayout } from "../../../layouts";
import {
  Banner as HomeBanner,
  Explore as HomeExplore,
  Map as HomeMap,
  Recent as HomeRecent,
  Trips as HomeTrips,
} from "../../../components/Pages/(user)/Home";

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
