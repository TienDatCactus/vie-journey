import React from "react";
import { MainLayout } from "../../../layouts";
import { Stack } from "@mui/material";
import { CreatePlanForm } from "../../../components/Pages/(user)";
const PlanningFormation: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="h-dvh max-w-[62.5rem] min-w-1/2 flex items-center justify-center space-y-10">
        <h1 className="text-4xl font-bold">Plan a new trip</h1>
        <CreatePlanForm />
      </Stack>
    </MainLayout>
  );
};

export default PlanningFormation;
