import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Chip, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SlideCard = ({ slide, isCenter }: { slide: any; isCenter: boolean }) => {
  return (
    <div
      className={`p-2 relative overflow-hidden transition-all duration-300 ${
        isCenter ? "scale-105 z-10" : "scale-95"
      }`}
    >
      <div className={`flex-shrink-0 `}>
        <div className="relative">
          <img
            src={slide.image || "/placeholder.svg"}
            alt={`Travel destination ${slide.number}`}
            className={`w-full ${
              isCenter ? "h-100" : "h-90"
            } object-cover rounded-2xl border transition-all duration-300 `}
          />
        </div>
        {isCenter && (
          <div className="transition-all">
            <div className="text-center lg:text-left my-2 ">
              <h2 className="lg:text-xl font-medium mb-2 text-dark-900">
                {slide.title}
              </h2>
              <p className="lg:text-base font-light text-gray-600">
                {slide.description}
              </p>
            </div>
            <div className="flex justify-between items-center lg:*:px-4">
              <Button
                variant="outlined"
                className="text-gray-800 font-medium border-neutral-400 rounded-full "
              >
                From $910
              </Button>
              <Button className="bg-dark-900 text-neutral-100 rounded-full">
                Booking Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const HomeBanner: React.FC<{ imgs?: any[] }> = ({ imgs = [] }) => {
  const carouselData = [
    {
      id: 1,
      number: "01",
      image: imgs[0]?.url ?? "/images/ocean-beach-mountains-ud.jpg",
      title: "We don't just plan vacations; we create journeys",
      description:
        "tailored to your dreams, ensuring every moment is unforgettable.",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      number: "02",
      image: imgs[1]?.url ?? "/images/ocean-beach-mountains-ud.jpg",
      title: "With our trusted local partners, you'll discover",
      description:
        "hidden spots and cultural experiences that most travelers never get to see.",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      number: "03",
      image: imgs[2]?.url ?? "/images/ocean-beach-mountains-ud.jpg",
      title: "Experience authentic adventures beyond",
      description:
        "the typical tourist path with our carefully curated local experiences.",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      number: "04",
      image: imgs[1]?.url ?? "/images/ocean-beach-mountains-ud.jpg",
      title: "Create memories that last a lifetime",
      description:
        "with personalized itineraries designed just for you and your loved ones.",
      bgColor: "bg-orange-50",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const swiperRef = useRef<any>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setCurrentIndex(swiperRef.current.swiper.realIndex);
      const swiper = swiperRef.current.swiper;
      const handleSlideChange = () => {
        setCurrentIndex(swiper.realIndex);
      };

      swiper.on("slideChange", handleSlideChange);

      return () => {
        if (swiper && swiper.off) {
          swiper.off("slideChange", handleSlideChange);
        }
      };
    }
  }, []);
  return (
    <div className=" max-w-[75rem] pb-10  relative ">
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        <div>
          <Chip
            label="# Top Tours"
            className="bg-white border text-neutral-600 border-neutral-400"
          />
        </div>
        <div>
          <h2 className="lg:text-6xl lg:my-6 font-semibold">
            Top tours to spark your wanderlust
          </h2>
          <p className="text-dark-600 lg:text-lg">
            Explore our curated selection of must-visit destinations, complete
            with unbeatable prices, detailed itineraries, and unforgettable
            experiences. Your next adventure starts here!
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse py-10">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          slidesPerView={2}
          centeredSlides={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 3, // 2 items per slide on tablet and up
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 3, // 2 items per slide on desktop
              spaceBetween: 12,
            },
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span key="${index}" class="${className} custom-bullet"></span>`;
            },
          }}
          className="travel-swiper w-full h-full flex flex-col-reverse"
        >
          {carouselData.map((slide, i) => {
            const isCenter = currentIndex === i;
            return (
              <SwiperSlide className="lg:h-150" key={slide.id}>
                <SlideCard slide={slide} isCenter={isCenter} />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            <span className="font-bold">
              {swiperRef.current?.swiper?.realIndex !== undefined
                ? swiperRef.current.swiper.realIndex + 1
                : 1}
            </span>
            <span className="mx-1">/</span>
            <span>{carouselData.length}</span>
          </div>
          <div className="flex items-center justify-end gap-4 ">
            <IconButton
              className="rounded-full p-4 border border-neutral-300"
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
            >
              <ChevronLeft className="w-6 h-6" />
            </IconButton>

            <IconButton
              className="rounded-full p-4 border border-neutral-300"
              onClick={() => swiperRef.current?.swiper?.slideNext()}
            >
              <ChevronRight className="w-6 h-6" />
            </IconButton>
          </div>
        </div>
      </div>
      <style>{`
        .travel-swiper .swiper-pagination {
          position: static !important;
          text-align: center;
          display: flex !important;
          margin-bottom:2rem;
          justify-content: start !important;
        }

        .travel-swiper .custom-bullet {
          position: relative !important;
          width: 60px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }

        .travel-swiper .custom-bullet.swiper-pagination-bullet-active {
          background: #374151 !important;
          transform: scaleX(1.1 ) !important;
        }import { class } from './../../../../../node_modules/@openmapvn/openmapvn-gl/build/generate-struct-arrays';


        .travel-swiper .swiper-slide {
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .travel-swiper .swiper-slide-active {
          opacity: 1;
        }
        
      `}</style>
    </div>
  );
};

export default HomeBanner;
