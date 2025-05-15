import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, Stack, TextField } from "@mui/material";
import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
export const CreatePlanForm: React.FC = () => {
  return (
    <Stack className="w-full gap-4">
      <TextField
        id="input-with-icon-textfield"
        color="primary"
        label="Destination"
        placeholder="e.g Ta xua, Sapa, Da Nang"
        slotProps={{
          input: {
            startAdornment: (
              <p className="min-w-[6.25rem] text-[14px] font-medium text-[#6d6d6d]">
                Where to go ?
              </p>
            ),
          },
        }}
        variant="outlined"
      />
      <DateTimePicker label="Basic date time picker" />
    </Stack>
  );
};

export default CreatePlanForm;
