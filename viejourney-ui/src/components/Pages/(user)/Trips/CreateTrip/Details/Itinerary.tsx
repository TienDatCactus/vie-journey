import {
  AccessTime,
  AttachMoney,
  DirectionsBus,
  DirectionsCar,
  DirectionsWalk,
  Settings,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardMedia,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import React from "react";
import { Link } from "react-router-dom";
const Itinerary: React.FC = () => {
  return (
    <section className="pt-10">
      <div className="bg-white lg:p-10 lg:px-12">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <h1 className="text-3xl font-bold">Itinerary</h1>
          <DateRangePicker
            slotProps={{
              textField: {
                variant: "standard",
                InputProps: {
                  disableUnderline: true, // Remove the underline for standard variant
                  sx: {
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    padding: "8px",
                    backgroundColor: "transparent",
                    "& .MuiInputBase-input": {
                      padding: "4px 8px",
                    },
                    boxShadow: "none",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  },
                },
              },
            }}
          />
        </Stack>
        <ul className="list-none py-4">
          <Accordion
            elevation={0}
            className="bg-white "
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary
              expandIcon={<Settings />}
              aria-controls="panel1bh-content"
              className="group p-0"
              id="panel1bh-header"
            >
              <h1 className="text-2xl font-bold group-hover:underline">
                Wednesday, 11th June
              </h1>
            </AccordionSummary>
            <AccordionDetails className="p-0">
              <Card
                elevation={0}
                className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-42 flex-col space-x-4 relative"
              >
                <CardContent className=" lg:py-4 gap-4 flex flex-col bg-neutral-200 rounded-xl col-span-2">
                  <h1 className="text-2xl font-semibold">Assam</h1>
                  {/* <p>
            A beautiful state in northeastern India known for its tea
            plantations and wildlife.
          </p> */}
                  <TextField
                    variant="standard"
                    placeholder="Add a note"
                    multiline
                  />
                  <p className="italic text-xs text-gray-600 font-semibold">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corrupti, velit quibusdam corporis doloremque, ea voluptates
                    quaerat ipsam odio exercitationem eligendi facilis
                    voluptatem asperiores dolor officia eaque beatae eius
                    deleniti odit!
                  </p>
                  <Stack
                    direction="row"
                    className=" *:py-0 *:text-dark-700 *:hover:text-dark-950 *:hover:bg-neutral-100 "
                    spacing={1}
                  >
                    <Button
                      startIcon={<AccessTime className="text-xl" />}
                      variant="text"
                    >
                      Add time
                    </Button>
                    <Button
                      startIcon={<AttachMoney className="text-xl" />}
                      variant="text"
                    >
                      Add cost
                    </Button>
                  </Stack>
                </CardContent>
                <CardMedia
                  component="img"
                  src="/images/ocean-beach-mountains-ud.jpg"
                  className="object-cover col-span-1 lg:max-h-42 w-full h-full rounded-lg"
                />
                {/* Time indicator dot at bottom of first card */}
              </Card>
              <div className="lg:min-h-14 relative">
                <div className="border-r-2 border-dashed border-gray-300 h-full absolute left-[1.75rem] top-0 bottom-0 z-0 transform -translate-x-1/2"></div>
                <Stack className="absolute lg:left-1/12 lg:min-w-30 lg:top-0 lg:bottom-0 z-10 flex justify-center">
                  <Select
                    id="demo-simple-select"
                    defaultValue={"car"}
                    variant="standard"
                    disableUnderline
                    className="text-neutral-800 text-sm"
                    inputProps={{}}
                  >
                    <MenuItem value={"car"}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        className="*:text-sm *:text-neutral-800"
                      >
                        <DirectionsCar />
                        Car
                      </Stack>
                    </MenuItem>
                    <MenuItem value={"walk"}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        className="*:text-sm *:text-neutral-800"
                      >
                        <DirectionsWalk />
                        Walk
                      </Stack>
                    </MenuItem>
                    <MenuItem value={"bus"}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        className="*:text-sm *:text-neutral-800"
                      >
                        <DirectionsBus />
                        Bus
                      </Stack>
                    </MenuItem>
                  </Select>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <p className="text-sm">1 hr 9 mins</p>
                    <div className=" w-2 h-2 rounded-full bg-gray-400 border border-white z-20 transform"></div>
                    <p className="text-sm">97km</p>
                    <Link to="#" className="text-sm text-neutral-900">
                      Direction
                    </Link>
                  </Stack>
                </Stack>
              </div>
              <Card
                elevation={0}
                className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-42 flex-col space-x-4 relative"
              >
                <CardContent className=" lg:py-4 gap-4 flex flex-col bg-neutral-200 rounded-xl col-span-2">
                  <h1 className="text-2xl font-semibold">Assam</h1>
                  {/* <p>
            A beautiful state in northeastern India known for its tea
            plantations and wildlife.
          </p> */}
                  <TextField
                    variant="standard"
                    placeholder="Add a note"
                    multiline
                  />
                  <p className="italic text-xs text-gray-600 font-semibold">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corrupti, velit quibusdam corporis doloremque, ea voluptates
                    quaerat ipsam odio exercitationem eligendi facilis
                    voluptatem asperiores dolor officia eaque beatae eius
                    deleniti odit!
                  </p>
                  <Stack
                    direction="row"
                    className=" *:py-0 *:text-dark-700 *:hover:text-dark-950 *:hover:bg-neutral-100 "
                    spacing={1}
                  >
                    <Button
                      startIcon={<AccessTime className="text-xl" />}
                      variant="text"
                    >
                      Add time
                    </Button>
                    <Button
                      startIcon={<AttachMoney className="text-xl" />}
                      variant="text"
                    >
                      Add cost
                    </Button>
                  </Stack>
                </CardContent>
                <CardMedia
                  component="img"
                  src="/images/ocean-beach-mountains-ud.jpg"
                  className="object-cover col-span-1 lg:max-h-42 w-full h-full rounded-lg"
                />
              </Card>
            </AccordionDetails>
          </Accordion>
        </ul>
      </div>
    </section>
  );
};

export default Itinerary;
