import React from "react";
import bg from "/images/ocean-beach-mountains-ud.jpg";

const HomeBanner: React.FC = () => {
  return (
    <div className="flex justify-center max-w-[1000px] pb-10 relative ">
      <img
        src={bg || `https://placehold.co/600x400/1a1a1a/ffffff?text=Banner`}
        alt="banner"
        className="rounded-xl shadow-md h-[600px] object-cover object-bottom"
      />
      <div className="absolute pt-12 translate-y-1/2 top-20 text-center max-w-3/4 text-white drop-shadow-md *:text-shadow-md">
        <h1 className="my-2 text-7xl font-bold"> Enjoy your travel</h1>
        <p className="my-2 text-2xl text-[#f2f2f2]">
          Discover the most unique and vibrant experiences the Azores have to
          offer
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;
