import { ChevronLeft, ChevronRight, DoubleArrow } from "@mui/icons-material";
import { Button, Chip, IconButton } from "@mui/material";
import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const carouselData = [
  {
    id: 1,
    number: "01",
    image: "/placeholder.svg?height=300&width=400",
    title: "We don't just plan vacations; we create journeys",
    description:
      "tailored to your dreams, ensuring every moment is unforgettable.",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    number: "02",
    image: "/placeholder.svg?height=300&width=400",
    title: "With our trusted local partners, you'll discover",
    description:
      "hidden spots and cultural experiences that most travelers never get to see.",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    number: "03",
    image: "/placeholder.svg?height=300&width=400",
    title: "Experience authentic adventures beyond",
    description:
      "the typical tourist path with our carefully curated local experiences.",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    number: "04",
    image: "/placeholder.svg?height=300&width=400",
    title: "Create memories that last a lifetime",
    description:
      "with personalized itineraries designed just for you and your loved ones.",
    bgColor: "bg-orange-50",
  },
];
const SlideCard = ({ slide }: { slide: (typeof carouselData)[0] }) => {
  return (
    <div className={`rounded-2xl  p-8 relative overflow-hidden `}>
      {/* Slide Number */}
      <div className="absolute top-6 right-6">
        <span className="text-4xl font-mono lg:text-6xl font-light text-black select-none">
          {slide.number}
        </span>
      </div>

      {/* Content Container */}
      {/* Image */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={slide.image || "/placeholder.svg"}
            alt={`Travel destination ${slide.number}`}
            className="w-80 h-50 object-cover rounded-2xl border border-neutral-300 shadow-md"
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left my-2">
          <h2 className="text-xl lg:text-xl font-light text-gray-800 leading-tight mb-4">
            {slide.title}{" "}
            <span className="text-gray-500 font-light">
              {slide.description}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};
const HomeAdvert: React.FC = () => {
  const swiperRef = useRef<any>(null);

  return (
    <div className="max-w-[1200px] py-10  w-full">
      <div className="grid grid-cols-12 gap-4 p-4 ">
        <div className="col-span-3 flex items-start justify-start">
          <Chip
            label="# About Us"
            className="bg-white border  border-neutral-400"
          />
        </div>
        <div className="text-start col-span-6">
          <h2 className="lg:text-6xl text-3xl font-medium mb-4">
            What's so special about this?
          </h2>
          <p className="text-neutral-700 lg:text-base">
            Save more on your trips with exclusive discounts, seasonal
            promotions, and unbeatable deals for unforgettable adventures.*
          </p>
        </div>
        <div className="col-span-3 flex justify-end items-end">
          <Button
            endIcon={<DoubleArrow />}
            className="bg-dark-800 text-white px-6 py-4"
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="relative w-full mt-6">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2, // 2 items per slide on tablet and up
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 2, // 2 items per slide on desktop
              spaceBetween: 12,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span key="${index}" class="${className} custom-bullet"></span>`;
            },
          }}
          className="travel-swiper w-full h-full "
        >
          {carouselData.map((slide) => (
            <SwiperSlide
              key={slide.id}
              className="bg-white h-[360px] shadow-sm border border-neutral-200"
            >
              <SlideCard slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
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
      <style>{`
        .travel-swiper .swiper-pagination {
          position: static !important;
          margin-top: 2rem;
          text-align: center;
          display: flex !important;
          justify-content: start !important;
        }

        .travel-swiper .custom-bullet {
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
        }

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

export default HomeAdvert;
