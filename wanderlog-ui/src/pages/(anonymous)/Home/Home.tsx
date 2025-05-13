import { MainLayout } from "../../../layouts";
import {
  HomeAdvert,
  HomeBanner,
  HomeCatCall,
  HomeGuides,
  HomeHero,
  HomeTours,
} from "../../../components/Pages/(anonymous)/Home";

const Home = () => {
  return (
    <MainLayout>
      <HomeHero />
      <HomeAdvert />
      <HomeGuides />
      <HomeBanner />
      <HomeTours />
      <HomeCatCall />
    </MainLayout>
  );
};

export default Home;
