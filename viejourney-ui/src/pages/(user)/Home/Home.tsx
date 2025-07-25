import React, { useEffect } from "react";

import {
  Banner as HomeBanner,
  Explore as HomeExplore,
  Recent as HomeRecent,
  Trips as HomeTrips,
} from "../../../components/Pages/(user)/Home";
import { MainLayout } from "../../../layouts";
import { useBlogStore } from "../../../services/stores/useBlogStore";
import { useTripDetailStore } from "../../../services/stores/useTripDetailStore";

const Home: React.FC = () => {
  const { handleGetUserTrips } = useTripDetailStore();
  const { fetchMyBlogs, fetchBlogs } = useBlogStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMyBlogs();
        await handleGetUserTrips();
        await fetchBlogs();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [fetchMyBlogs, handleGetUserTrips]);
  return (
    <MainLayout>
      <HomeBanner />
      <HomeRecent />
      <HomeTrips />
      <HomeExplore />
    </MainLayout>
  );
};

export default Home;
