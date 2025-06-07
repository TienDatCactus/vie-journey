import { Edit, ExpandMore, Explore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
} from "@mui/material";

import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import React from "react";
const Header: React.FC = () => {
  return (
    <section>
      <div className="z-10 relative w-full lg:h-[17.5rem]">
        <img
          src="/images/placeholders/main-placeholder.jpg"
          onError={(e) =>
            (e.currentTarget.src = "/images/placeholders/main-placeholder.jpg")
          }
          alt=""
          className="w-full h-[17.5rem] object-cover"
        />
        <IconButton className="absolute top-4 right-4 bg-neutral-50/20">
          <Edit className="text-neutral-200 " />
        </IconButton>
        <div className="absolute bottom-0 left-0 w-full h-[10rem] bg-gradient-to-t from-neutral-900 to-transparent"></div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2  lg:w-3/4 lg:h-[12rem] rounded-2xl shadow-md bg-white *:text-neutral-800 p-4 flex flex-col justify-between itemce">
          <div className="hover:bg-neutral-300 w-fit p-2 rounded-md transition-all duration-200">
            <h1 className="text-4xl font-bold">Trip Title</h1>
          </div>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <div>
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
                defaultValue={[dayjs("2023-01-01"), dayjs("2023-01-31")]}
              />
            </div>
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                },
              }}
              max={4}
            >
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
              />
            </AvatarGroup>
          </Stack>
        </div>
      </div>
      <div className="lg:py-10 lg:px-10">
        <Accordion
          elevation={0}
          className="bg-neutral-100"
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            className="group"
            id="panel1bh-header"
          >
            <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
              Explore
            </h1>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid *:bg-neutral-100 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card elevation={0} className="max-w-[240px] flex flex-col">
                <CardMedia
                  component="img"
                  className="w-full rounded-lg object-cover"
                  image="/images/ocean-beach-mountains-ud.jpg"
                  alt="name"
                />
                <CardContent className="p-0 lg:py-1">
                  <h1 className="text-lg font-semibold text-dark-900">
                    Sights in Chiapas and Tabasco
                  </h1>
                  <p className="text-sm text-neutral-600 font-medium text-ellipsis line-clamp-2">
                    Explore the natural beauty and cultural richness of Chiapas
                    and Tabasco, two states in southern Mexico.
                  </p>
                </CardContent>
                <CardActions className="flex items-center gap-1 p-0 py-2">
                  <Avatar className="lg:w-8 lg:h-8" />
                  <h2 className="text-sm text-neutral-800 font-medium">
                    Fodors
                  </h2>
                </CardActions>
              </Card>
              <Card elevation={0} className="max-w-[240px] flex flex-col">
                <CardMedia
                  component="img"
                  className="w-full rounded-lg object-cover"
                  image="/images/ocean-beach-mountains-ud.jpg"
                  alt="name"
                />
                <CardContent className="p-0 lg:py-1">
                  <h1 className="text-lg font-semibold text-dark-900">
                    Sights in Chiapas and Tabasco
                  </h1>
                  <p className="text-sm text-neutral-600 font-medium text-ellipsis line-clamp-2">
                    Explore the natural beauty and cultural richness of Chiapas
                    and Tabasco, two states in southern Mexico.
                  </p>
                </CardContent>
                <CardActions className="flex items-center gap-1 p-0 py-2">
                  <Avatar className="lg:w-8 lg:h-8" />
                  <h2 className="text-sm text-neutral-800 font-medium">
                    Fodors
                  </h2>
                </CardActions>
              </Card>
              <Card elevation={0} className="max-w-[240px] flex flex-col">
                <CardMedia
                  component="img"
                  className="w-full rounded-lg object-cover"
                  image="/images/ocean-beach-mountains-ud.jpg"
                  alt="name"
                />
                <CardContent className="p-0 lg:py-1">
                  <h1 className="text-lg font-semibold text-dark-900">
                    Sights in Chiapas and Tabasco
                  </h1>
                  <p className="text-sm text-neutral-600 font-medium text-ellipsis line-clamp-2">
                    Explore the natural beauty and cultural richness of Chiapas
                    and Tabasco, two states in southern Mexico.
                  </p>
                </CardContent>
                <CardActions className="flex items-center gap-1 p-0 py-2">
                  <Avatar className="lg:w-8 lg:h-8" />
                  <h2 className="text-sm text-neutral-800 font-medium">
                    Fodors
                  </h2>
                </CardActions>
              </Card>
            </div>
            <div className="flex justify-end py-2">
              <Button
                variant="contained"
                className="bg-dark-800"
                color="primary"
                endIcon={<Explore />}
              >
                Explore More
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </section>
  );
};

export default Header;
