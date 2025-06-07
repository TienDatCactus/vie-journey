import React from "react";
import { HotelLayout } from "../../../layouts";
import {
  Ads as HotelAds,
  Citing as HotelCiting,
  Hero as HotelHero,
  Preview as HotelPreview,
  Rating as HotelRating,
  RelatedBlogs as HotelRelatedBlogs,
} from "../../../components/Pages/(user)/Hotel";

export const Hotels: React.FC = () => {
  return (
    <HotelLayout>
      <HotelHero />
      <HotelPreview />
      <HotelRating />
      <HotelAds />
      <HotelCiting />
      <HotelRelatedBlogs />
    </HotelLayout>
  );
};

export default Hotels;
