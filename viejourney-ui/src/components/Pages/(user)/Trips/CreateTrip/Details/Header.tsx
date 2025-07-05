import { Close, Edit, ExpandMore, Explore, Upload } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import * as React from "react";

import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Header: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const trip = useTripDetailStore((state) => state.trip);
  return (
    <section>
      <div className="z-10 relative w-full lg:h-[17.5rem]">
        <img
          src="/images/placeholders/main-placeholder.jpg"
          alt=""
          className="w-full h-[17.5rem] object-cover"
        />
        <IconButton
          onClick={handleClickOpen}
          className="absolute top-4 right-4 bg-neutral-50/20"
        >
          <Edit className="text-neutral-200 " />
        </IconButton>
        <div className="absolute bottom-0 left-0 w-full h-[10rem] bg-gradient-to-t from-neutral-900 to-transparent"></div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2  lg:w-3/4 lg:h-[12rem] rounded-2xl shadow-md bg-white *:text-neutral-800 p-4 flex flex-col justify-between itemce">
          <div className="hover:bg-neutral-300 w-fit p-2 rounded-md transition-all duration-200">
            <h1 className="text-4xl font-bold">{trip?.title}</h1>
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
                defaultValue={[dayjs(trip?.startDate), dayjs(trip?.endDate)]}
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
              max={trip?.tripmates?.length || 1}
            >
              {trip?.tripmates?.map((mate, index) => (
                <Avatar
                  key={index}
                  alt={mate}
                  content={mate}
                  src={"/static/images/avatar/1.jpg"}
                />
              ))}
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
                  className="w-full  object-cover"
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
                  className="w-full  object-cover"
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
                  className="w-full  object-cover"
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
      <Dialog
        slotProps={{
          transition: { unmountOnExit: true },
          paper: {
            className: "bg-white  shadow-lg min-w-200",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack>
            <h1 className="text-2xl">Change cover image</h1>
            <IconButton
              className="absolute top-2 right-2"
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent className="">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Your Photos" {...a11yProps(0)} />
              <Tab label="Select Photos" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              <img
                src="/images/svg/undraw_upload-image_tpmp.svg"
                alt="upload image"
                className="lg:w-100 h-auto mx-auto"
              />
              <h1 className="text-3xl font-semibold">Upload your photos</h1>
              <p className="text-base text-neutral-600">
                You haven't uploaded any photos
              </p>
              <Button startIcon={<Upload />} variant="contained" className="">
                Upload your photos
              </Button>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Stack
              className="grid lg:grid-cols-3"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <img
                  key={index}
                  src="/images/placeholders/main-placeholder.jpg"
                  alt={`placeholder-${index}`}
                  className="w-full h-auto object-cover  cursor-pointer hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Stack>
          </CustomTabPanel>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Header;
