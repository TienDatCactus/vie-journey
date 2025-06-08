import { Chip, Stack } from "@mui/material";
import React from "react";
import { MainLayout } from "../../../layouts";
import { CreateTripForm } from "../../../components/Pages/(user)/Trips";
import { AutoAwesome } from "@mui/icons-material";
const CreateTrip: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="py-20 max-w-[125rem] min-w-[37.5rem] flex items-center justify-center space-y-10">
        <div className="text-center space-y-2">
          <Chip
            label="AI Powered Trip Planning"
            icon={<AutoAwesome className="text-blue-700" />}
            className="px-2 bg-blue-200 text-blue-800 font-semibold text-sm"
          />
          <h1 className="text-5xl font-semibold">
            Plan your next{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
              adventure
            </span>
          </h1>
          <p className="text-base text-neutral-600 max-w-[40rem] mx-auto">
            Create personalized itineraries, discover hidden gems, and make
            unforgettable memories with our intelligent trip planning assistant.
          </p>
        </div>
        <div className="grid grid-cols-6 gap-4 w-full max-w-[75rem] mx-auto">
          <CreateTripForm />
          <div className="lg:col-span-2 bg-neutral-100">dat</div>
        </div>
      </Stack>
    </MainLayout>
  );
};

export default CreateTrip;
