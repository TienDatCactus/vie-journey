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
import { Box, Container, Fade } from "@mui/material";
import HomePageSkeleton from "../../../utils/handlers/loading/LandingSkeleton";
const Home = () => {
  const { doGetAssets, landingAssets } = useAssetsStore();
  const [loading, setLoading] = useState(true);
  const [sectionsLoaded, setSectionsLoaded] = useState({
    hero: false,
    intro: false,
    destination: false,
    hotel: false,
    creator: false,
    call: false,
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        await doGetAssets();

        // Simulate staggered loading for better UX
        const sections = Object.keys(sectionsLoaded);
        sections.forEach((section, index) => {
          setTimeout(() => {
            setSectionsLoaded((prev) => ({
              ...prev,
              [section]: true,
            }));
          }, (index + 1) * 200);
        });
      } catch (error) {
        console.error("Lỗi khi load asset trang chủ:", error);
        // Load all sections even on error
        setSectionsLoaded({
          hero: true,
          intro: true,
          destination: true,
          hotel: true,
          creator: true,
          call: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [doGetAssets]);

  const hasAssets = landingAssets && Object.keys(landingAssets).length > 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      {loading || !sectionsLoaded.hero || !hasAssets ? (
        <HomePageSkeleton.Hero />
      ) : (
        <Fade in={sectionsLoaded.hero} timeout={800}>
          <div className="w-full">
            <HomeHero img={landingAssets?.hero?.[0]?.url || ""} />
          </div>
        </Fade>
      )}

      {/* Intro/Advert Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading || !sectionsLoaded.intro || !landingAssets?.intro ? (
          <HomePageSkeleton.Advert />
        ) : (
          <Fade in={sectionsLoaded.intro} timeout={800}>
            <div>
              <HomeAdvert imgs={landingAssets.intro} />
            </div>
          </Fade>
        )}
      </Container>

      {/* Destination/Guides Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ||
        !sectionsLoaded.destination ||
        !landingAssets?.destination ? (
          <HomePageSkeleton.Guides />
        ) : (
          <Fade in={sectionsLoaded.destination} timeout={800}>
            <div>
              <HomeGuides imgs={landingAssets?.destination} />
            </div>
          </Fade>
        )}
      </Container>

      {/* Hotel/Banner Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading || !sectionsLoaded.hotel || !landingAssets?.hotel ? (
          <HomePageSkeleton.Banner />
        ) : (
          <Fade in={sectionsLoaded.hotel} timeout={800}>
            <div>
              <HomeBanner imgs={landingAssets?.hotel} />
            </div>
          </Fade>
        )}
      </Container>

      {/* Creator/Testimonial Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading || !sectionsLoaded.creator || !landingAssets?.creator ? (
          <HomePageSkeleton.Testimonial />
        ) : (
          <Fade in={sectionsLoaded.creator} timeout={800}>
            <div>
              <HomeTestimonial imgs={landingAssets?.creator} />
            </div>
          </Fade>
        )}
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ mt: 4 }}>
        {loading || !sectionsLoaded.call ? (
          <HomePageSkeleton.CallToAction />
        ) : (
          <Fade in={sectionsLoaded.call} timeout={800}>
            <div>
              <HomeCall />
            </div>
          </Fade>
        )}
      </Box>
    </MainLayout>
  );
};

export default Home;
