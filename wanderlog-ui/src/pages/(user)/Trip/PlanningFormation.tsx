import React from "react";
import { MainLayout } from "../../../layouts";
import { CreatePlanForm } from "../../../components/Pages/(user)/Trips";
import { Stack } from "@mui/material";
const PlanningFormation: React.FC = () => {
  return (
    <MainLayout>
      <Stack className="h-dvh max-w-[62.5rem] min-w-1/2 flex items-center justify-center">
        <h1>Plan a new trip</h1>
        <CreatePlanForm />
      </Stack>
    </MainLayout>
  );
};

export default PlanningFormation;
