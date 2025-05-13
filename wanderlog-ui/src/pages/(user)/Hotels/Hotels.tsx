import React from "react";
import { HotelLayout } from "../../../layouts";
import {
  HotelAds,
  HotelCiting,
  HotelHero,
  HotelPreview,
  HotelRating,
  HotelRelatedBlogs,
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
