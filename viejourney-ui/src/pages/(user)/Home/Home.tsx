import React, { useEffect } from "react";

import {
  Banner as HomeBanner,
  Explore as HomeExplore,
  Recent as HomeRecent,
  Trips as HomeTrips,
} from "../../../components/Pages/(user)/Home";
import { MainLayout } from "../../../layouts";
import { useTripDetailStore } from "../../../services/stores/useTripDetailStore";
import { useUserBlog } from "../../../services/stores/useBlogStore";
import { IRelatedBlogs } from "../../../utils/interfaces/blog";

const Home: React.FC = () => {
  const [blogs, setBlogs] = React.useState<IRelatedBlogs[]>([]);
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
      <HomeTrips blogs={blogs} />
      <HomeExplore blogs={blogs} />
    </MainLayout>
  );
};

export default Home;
