import { Add } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
export const CreateTripForm: React.FC = () => {
  return (
    <Stack className="w-full gap-4">
      <TextField
        className="rounded-lg"
        id="input-with-icon-textfield"
        color="primary"
        label="Destination"
        placeholder="e.g Ta xua, Sapa, Da Nang"
        slotProps={{
          input: {
            startAdornment: (
              <p className="min-w-[7.5rem] text-base font-semibold">
                Where to go ?
              </p>
            ),
          },
        }}
        variant="outlined"
      />
      <div>
        <label className="text-base ">
          Dates <span>(optionals)</span>
        </label>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="w-full"
          gap={2}
        >
          <DateTimePicker label="Start date" className="w-1/2" />
          <DateTimePicker label="End date" className="w-1/2" />
        </Stack>
      </div>
      <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
        <a className="flex items-center justify-center gap-1 *:text-neutral-700 hover:underline">
          <Add className="text-base" />
          <span>Invite tripmates</span>
        </a>
        <a className="flex items-center justify-center gap-1 *:text-neutral-700">
          <PublicIcon className="text-base" />
          <span>Public</span>
        </a>
      </Stack>
      <div className="mx-auto mt-10">
        <Button variant="contained" className="p-4 rounded-4xl font-semibold">
          Start planning
        </Button>
        <a className="mt-6 text-center block text-neutral-600 font-semibold cursor-pointer hover:underline text-sm">
          Or write a new blog
        </a>
      </div>
    </Stack>
  );
};

export default CreateTripForm;
