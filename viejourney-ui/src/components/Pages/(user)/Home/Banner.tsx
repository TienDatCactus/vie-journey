import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import { Link } from "react-router-dom";
const HomeBanner: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <div className="max-w-[75rem] py-10 relative flex flex-col items-center justify-center w-full ">
      <img
        src="/images/welcome-banner.jpg"
        alt=""
        className="object-cover w-full lg:h-100 brightness-50 rounded-2xl"
      />
      <div className="absolute top-0 lg:left-10 w-full h-full flex flex-col items-start justify-center text-white lg:text-start text-center">
        <h1 className="text-6xl font-bold">Welcome back, {user?.email}!</h1>
        <p className="w-2/3 text-neutral-400 py-4">
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
