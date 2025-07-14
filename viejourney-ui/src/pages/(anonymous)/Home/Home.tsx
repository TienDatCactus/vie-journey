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

const Home = () => {
  const { doGetAssets } = useAssetsStore();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<any>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const response = await doGetAssets();
        setAssets(response);
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
      <HomeHero img={assets?.hero[0]?.url} />
      {assets?.intro && <HomeAdvert imgs={assets.intro} />}
      {assets?.destination && <HomeGuides imgs={assets?.destination} />}
      {assets?.destination && <HomeBanner imgs={assets?.destination} />}
      {assets?.destination && <HomeTestimonial imgs={assets?.destination} />}
      <HomeCall />
    </MainLayout>
  );
};

export default Home;
