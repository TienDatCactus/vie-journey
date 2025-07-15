import { MainLayout } from "../../../layouts";

import { useEffect, useState } from "react";
import {
  HomeAdvert,
  HomeBanner,
  HomeCall,
  HomeGuides,
  HomeHero,
  HomeTestimonial,
} from "../../../components/Pages/(anonymous)/Home";
import { useAssetsStore } from "../../../services/stores/useAssets";
import { Backdrop } from "@mui/material";

const Home = () => {
  const { doGetAssets, landingAssets } = useAssetsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        await doGetAssets();
      } catch (error) {
        console.error("Lỗi khi load asset trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [doGetAssets]);
  return (
    <MainLayout>
      <HomeHero img={landingAssets?.hero?.[0]?.url || ""} />
      {landingAssets?.intro && <HomeAdvert imgs={landingAssets.intro} />}
      {loading ? <Backdrop open={loading} /> : null}
      {landingAssets?.destination && (
        <HomeGuides imgs={landingAssets?.destination} />
      )}
      {landingAssets?.hotel && <HomeBanner imgs={landingAssets?.hotel} />}
      {landingAssets?.creator && (
        <HomeTestimonial imgs={landingAssets?.creator} />
      )}
      <HomeCall />
    </MainLayout>
  );
};

export default Home;
