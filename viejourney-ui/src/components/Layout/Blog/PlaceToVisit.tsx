import React from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Divider from "@mui/material/Divider";

const PlaceToVisit = () => {
  return (
    <div className="w-full ">
      <Divider className="mt-3 mx-3"></Divider>
      <div className="my-3 flex gap-3 items-start hover:bg-[#F3F4F5] rounded-2xl py-3 px-3">
        <div className="marker bg-blue-600 w-6 h-6 text-white flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 mt-1">
          1
        </div>
        <div className="destination flex-1 flex justify-between items-start">
          <div className="content-left flex-1 pr-4">
            <div className="font-bold text-lg mb-1">
              Luis Munoz Marin International Airport
            </div>
            <div className="flex gap-2 mb-2">
              <span className="bg-gray-200 font-bold text-gray-700 px-2 py-1 rounded-2xl text-xs">
                International Airport
              </span>
              <span className="bg-gray-200 font-bold text-gray-700 px-2 py-1 rounded-2xl text-xs">
                Airport
              </span>
            </div>
            <div className="text-gray-700 mb-3">
              Uber to Hotel. Car rentals at the airport are busy.
            </div>
            <div className="text-xs text-gray-500"> 17 min · 13 km</div>
          </div>
          <div className="right-section flex flex-col items-end w-50 flex-shrink-0 gap-1">
            <div className="save-button mb-2 bg-black text-white rounded-full px-3 py-1 shadow-sm cursor-pointer hover:bg-gray-800 font-[500] flex items-center gap-1">
              <BookmarkBorderIcon fontSize="small" className="text-white" />
              <span className="text-[14px]">Save</span>
            </div>
            <div className="image-container w-full h-30">
              <img
                src="https://itin-dev.wanderlogstatic.com/freeImage/85HuNZ0LG2pRL6M9I6D75BW3xdqq3war"
                alt="airport image"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceToVisit;
