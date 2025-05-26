import { Stack } from "@mui/material";
import React from "react";
import { MainLayout } from "../../../layouts";
import { CreateTripForm } from "../../../components/Pages/(user)";
const CreateTrip: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="py-20 max-w-[125rem] min-w-[37.5rem] flex items-center justify-center space-y-10">
        <h1 className="text-4xl font-bold">Plan a new trip</h1>
        <CreateTripForm />
      </Stack>
    </MainLayout>
  );
};

export default CreateTrip;
