import { MainLayout } from "../../../layouts";
import {
  HomeAdvert,
  HomeBanner,
  HomeCall,
  HomeGuides,
  HomeHero,
  HomeTestimonial,
} from "../../../components/Pages/(anonymous)/Home";

const Home = () => {
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
