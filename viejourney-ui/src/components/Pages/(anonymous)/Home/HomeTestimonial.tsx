import { Chip } from "@mui/material";
import React from "react";
const HomeTestimonial: React.FC<{ imgs?: any[] }> = ({ imgs = [] }) => {
  return (
    <div className="max-w-[1200px] lg:py-10 lg:pb-20 text-center">
      <Chip
        label="# Testimonials"
        className="bg-white border text-neutral-600 border-neutral-400"
      />
      <h2 className="text-4xl lg:text-6xl font-light py-6 text-dark-900">
        I've been on countless trips, but this one was different. Everything was
        perfectly organized,
        <span className="text-neutral-700">
          and the local insights made it truly unique
        </span>
        .{" "}
        <span className="text-neutral-500">
          Can't wait for my next adventure!
        </span>
      </h2>
      <ul className="flex justify-center items-center gap-8 mt-6">
        <li>
          <img
            src= {imgs[0].url ?? "/images/pexels-elletakesphotos-1680172.jpg"}
            alt="testimonial 1"
            className=" w-40 h-40 object-cover shadow-lg grayscale"
          />
        </li>
        <li className="scale-110 transition-all duration-200 hover:scale-125">
          <img
            src={imgs[1].url ?? "/images/pexels-elletakesphotos-1680172.jpg"}
            alt="testimonial 2"
            className=" w-40 h-40 object-cover shadow-lg "
          />
          <h3 className="text-dark-900 font-semibold">James Carter</h3>
          <p className="text-dark-700">The Adventure Junkie</p>
        </li>
        <li>
          <img
            src={imgs[2].url ?? "/images/pexels-elletakesphotos-1680172.jpg"}
            alt="testimonial 3"
            className=" w-40 h-40 object-cover shadow-lg grayscale"
          />
        </li>
      </ul>
    </div>
  );
};

export default HomeTestimonial;
