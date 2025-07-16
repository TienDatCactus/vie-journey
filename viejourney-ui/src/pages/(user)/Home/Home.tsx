import React, { useEffect, useState } from "react";

import {
  Banner as HomeBanner,
  Explore as HomeExplore,
  Recent as HomeRecent,
  Trips as HomeTrips,
} from "../../../components/Pages/(user)/Home";
import { MainLayout } from "../../../layouts";
import { getBlogList } from "../../../services/api/blog";
import { useTripDetailStore } from "../../../services/stores/useTripDetailStore";
import { IBlog, IRelatedBlogs } from "../../../utils/interfaces/blog";
import { useUserBlog } from "../../../services/stores/useBlogStore";

const Home: React.FC = () => {
  const [blogs, setBlogs] = React.useState<IRelatedBlogs[]>([]);
  const [myBlogs, setMyBlogs] = useState<IBlog[]>([]);
  const { handleGetMyBlogs } = useUserBlog();

  const { handleGetUserTrips } = useTripDetailStore();
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getBlogList({});
      if (res) {
        setBlogs(res);
      }
      const resMyBlogs = await handleGetMyBlogs();
      if (resMyBlogs) setMyBlogs(resMyBlogs);
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
      <HomeTrips blogs={myBlogs} />
      <HomeExplore blogs={blogs} />
    </MainLayout>
  );
};

export default Home;
