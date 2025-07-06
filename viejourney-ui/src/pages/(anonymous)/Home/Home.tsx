import { MainLayout } from "../../../layouts";

import {
  HomeAdvert,
  HomeBanner,
  HomeCall,
  HomeGuides,
  HomeHero,
  HomeTestimonial,
} from "../../../components/Pages/(anonymous)/Home";
import { useEffect, useState } from "react";
import { useAssetsStore } from "../../../services/stores/useAssets";
import { getLandingAssets } from "../../../services/api/asset";

const Home = () => {
  const { assets, doGetAssets } = useAssetsStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getLandingAssets = async () => {
      try {
        setLoading(true);
        await doGetAssets();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getLandingAssets();
  }, [getLandingAssets]);

  console.log(assets);
  return (
    <MainLayout>
      <HomeHero />
      <HomeAdvert />
      <HomeGuides />
      <HomeBanner />
      <HomeTestimonial />
      <HomeCall />
    </MainLayout>
  );
};

export default Home;
