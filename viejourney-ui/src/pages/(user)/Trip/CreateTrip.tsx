import { AutoAwesome } from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";
import React from "react";
import { CreateTripForm } from "../../../components/Pages/(user)/Trips";
import { MainLayout } from "../../../layouts";
const CreateTrip: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="py-20 max-w-[125rem]  min-w-[37.5rem] flex items-center justify-center space-y-10">
        <div className="text-center space-y-2">
          <Chip
            label="VieJourney"
            icon={<AutoAwesome className="text-blue-600" />}
            className="p-1 bg-blue-200 text-blue-600 font-semibold text-sm"
          />
          <h1 className="text-5xl font-semibold">
            Plan your next trip{" "}
            <span className="bg-gradient-to-r from-blue-600 via-yellow-500 to-indigo-400 text-transparent bg-clip-text">
              effortlessly
            </span>
          </h1>
          <p className="text-base text-neutral-600 max-w-[40rem] mx-auto">
            Easily organize your itinerary, invite friends, and explore hidden
            gems.
          </p>
        </div>
        <CreateTripForm />
      </Stack>
    </MainLayout>
  );
};

export default CreateTrip;
