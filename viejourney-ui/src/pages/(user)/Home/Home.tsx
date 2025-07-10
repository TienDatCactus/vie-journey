import React, { useEffect } from "react";

import {
  Banner as HomeBanner,
  Explore as HomeExplore,
  Map as HomeMap,
  Recent as HomeRecent,
  Trips as HomeTrips,
} from "../../../components/Pages/(user)/Home";
import { MainLayout } from "../../../layouts";
import { useUserBlog } from "../../../services/stores/useUserBlog";
import { IBlog } from "../../../utils/interfaces/blog";
import { useTripDetailStore } from "../../../services/stores/useTripDetailStore";

const Home: React.FC = () => {
  const [blogs, setBlogs] = React.useState<IBlog[]>([]);
  const { handleGetUserTrips } = useTripDetailStore();
  const { getBlogList } = useUserBlog();
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getBlogList({});
      if (res) {
        setBlogs(res);
      }
    };
    fetchBlogs();
  }, []);
  useEffect(() => {
    (async () => {
      await handleGetUserTrips();
    })();
  }, []);
  return (
    <MainLayout>
      <HomeBanner />
      <HomeRecent />
      <HomeMap />
      {/* user's trips and blogs */}
      <HomeTrips blogs={blogs} />

      <HomeExplore blogs={blogs} />
    </MainLayout>
  );
};

export default Home;
