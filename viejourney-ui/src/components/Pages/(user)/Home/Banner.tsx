import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import Map from "../../../Maps/Map";
const HomeBanner: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <div className="max-w-[75rem] py-10 relative flex flex-col items-center justify-center w-full ">
      <div className="w-full h-100 mb-4  relative">
        <Map
          mapTypeControl={false}
          defaultCenter={{ lat: 0, lng: 0 }} // Example coordinates for Paris
          defaultZoom={5}
          position="relative"
          detailed={false}
          className="w-full h-full rounded-xl shadow-md drop-shadow-md"
        />
      </div>
      <div className="absolute top-0 lg:left-10 h-full flex flex-col items-start justify-center text-gray-800 lg:text-start w-1/3 space-y-2 text-center ">
        <h1 className="text-3xl font-bold pointer-events-none">
          Welcome back, {user?.email}!
        </h1>
        <p className=" text-gray-700 pointer-events-none">
          Continue exploring your dream destinations or plan your next
          adventure.
        </p>
        <Link to="/trips/create">
          <Button
            endIcon={<Add />}
            className="bg-neutral-50 text-black px-4 py-2"
          >
            Plan new Trip
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeBanner;
