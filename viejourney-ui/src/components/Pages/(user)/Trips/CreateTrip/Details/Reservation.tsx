import {
  AccessTime,
  Add,
  ArrowForward,
  AttachFile,
  AttachMoney,
  Circle,
  Cloud,
  CurrencyExchange,
  Delete,
  Directions,
  Edit,
  EmojiTransportation,
  ExpandMore,
  Explore,
  Hotel,
  MoreHoriz,
  OpenInNew,
  RestaurantMenu,
  Settings,
  Star,
  TaskAlt,
  TransferWithinAStation,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
const Reservation: React.FC = () => {
  const reservationItems = [
    { icon: <TransferWithinAStation />, label: "Transit" },
    { icon: <Hotel />, label: "Lodging" },
    { icon: <RestaurantMenu />, label: "Restaurant" },
    { icon: <AttachFile />, label: "Attachment" },
    { icon: <MoreHoriz />, label: "Others", disabled: true },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {
    handleSubmit,
    formState: { errors, isValidating },
    register,
  } = useForm();
  return (
    <section className="bg-white p-4 rounded-lg  lg:px-10">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 lg:col-span-9 bg-neutral-100 p-4 rounded-lg">
          <h1 className="text-base font-semibold text-dark-900">
            Reservations and attachments
          </h1>
          <ul className="flex justify-between">
            {reservationItems.map((item, index) => (
              <li key={index} className="flex flex-col items-center ">
                <IconButton disabled={item.disabled}>{item.icon}</IconButton>
                <p className="text-sm">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 lg:col-span-3 bg-neutral-100 p-4 rounded-lg flex flex-col  justify-between">
          <h1 className="text-base font-semibold text-dark-900">Budgeting</h1>
          <data>0,00 US$</data>
          <Link
            to={"/trips/create/details/budgeting"}
            className="no-underline font-semibold text-dark-700 text-sm cursor-pointer hover:text-dark-500"
          >
            View details
          </Link>
        </div>
      </div>
      {/* Notes */}
      <div>
        <Accordion
          elevation={0}
          className="bg-white py-4"
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            className="group"
            id="panel1bh-header"
          >
            <Badge badgeContent={4} color="warning">
              <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
                Notes
              </h1>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid gap-4">
              <Card
                elevation={0}
                className="w-full flex rounded-xl bg-amber-50 border border-amber-200 flex-col p-2 px-4"
              >
                <CardContent className="p-0 lg:py-1 gap-4 flex flex-col justify-between">
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <h1 className="text-lg font-semibold text-dark-900">
                      Note Title
                    </h1>
                    <IconButton
                      className="p-1"
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <Settings />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        list: {
                          "aria-labelledby": "basic-button",
                        },
                      }}
                    >
                      <MenuList>
                        <MenuItem>
                          <ListItemIcon>
                            <Delete fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Delete</ListItemText>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            ⌘X
                          </Typography>
                        </MenuItem>
                        <MenuItem>
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Edit</ListItemText>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            ⌘C
                          </Typography>
                        </MenuItem>

                        <Divider />
                        <MenuItem>
                          <ListItemIcon>
                            <Cloud fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Web Clipboard</ListItemText>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Stack>
                  <p className="text-base text-neutral-600 font-medium text-ellipsis line-clamp-2">
                    This is a note about the trip. It can contain any
                    information you want to remember.
                  </p>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <span>by:</span>
                    <Avatar className="lg:w-6 lg:h-6" />
                    <h2 className="text-sm text-neutral-800 font-medium">
                      Author Name
                    </h2>
                  </Stack>
                </CardContent>
              </Card>
              {/* Repeat Card for more notes */}
              <Divider textAlign="left">
                <Button endIcon={<Add />} className="text-dark-900">
                  Add more Notes
                </Button>
              </Divider>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      {/* Transits */}
      <Divider textAlign="left">
        <Chip
          icon={<EmojiTransportation />}
          label="Transits"
          className="font-semibold"
        />
      </Divider>
      <div>
        <Accordion
          elevation={0}
          className="bg-white py-4"
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            className="group"
            id="panel1bh-header"
          >
            <Badge badgeContent={4} color="primary">
              <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
                Transits
              </h1>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-4">
              <Card
                elevation={0}
                className="w-full flex rounded-xl bg-gray-50 border border-gray-200 flex-col p-2 px-4"
              >
                <CardContent className="p-0 lg:py-1 gap-4 flex flex-col justify-between">
                  <form onSubmit={handleSubmit((data) => console.log(data))}>
                    <Grid2
                      container
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <Grid2
                        size={{
                          lg: 8,
                        }}
                      >
                        <FormControl fullWidth className="mb-2">
                          <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                            Mode
                          </FormLabel>
                          <Select
                            variant="standard"
                            defaultValue="none"
                            size="small"
                            slotProps={{
                              input: {
                                className:
                                  "text-neutral-800 text-sm border-none no-underline",
                              },
                            }}
                            {...register("mode", { required: true })}
                          >
                            <MenuItem value="none" disabled>
                              Select Mode
                            </MenuItem>
                            {[
                              "Train",
                              "Flight",
                              "Car",
                              "Bus",
                              "Boat",
                              "Walk",
                              "Bike",
                              "Others",
                            ].map((mode) => (
                              <MenuItem key={mode} value={mode}>
                                {mode}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.mode && (
                            <FormHelperText error>
                              {errors?.root?.server && "Server error"}
                            </FormHelperText>
                          )}
                        </FormControl>
                        <FormControl fullWidth className="mb-2">
                          <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                            Departure
                          </FormLabel>
                          <Grid2 container spacing={2} alignItems="center">
                            <Grid2 size={4}>
                              <DatePicker
                                slotProps={{
                                  field: {
                                    className:
                                      "text-neutral-800 text-sm border-none",
                                  },
                                }}
                                className="*:text-neutral-800 *:text-sm "
                                defaultValue={dayjs("2023-01-01")}
                              />
                            </Grid2>
                            <Grid2 size={4}>
                              <TimePicker
                                slotProps={{
                                  field: {
                                    className:
                                      "text-neutral-800 text-sm border-none",
                                  },
                                }}
                                className="*:text-neutral-800 *:text-sm "
                                defaultValue={dayjs("2023-01-31")}
                              />
                            </Grid2>
                            <Grid2 size={4}>
                              <TextField
                                slotProps={{
                                  htmlInput: {
                                    className:
                                      "text-neutral-800 text-sm border-none no-underline  rounded-md p-2",
                                  },
                                }}
                                variant="standard"
                                inputMode="text"
                                {...register("departureLocation", {
                                  required: "Departure location is required",
                                })}
                                placeholder="Location"
                              />
                            </Grid2>
                          </Grid2>
                          {errors.departureLocation && (
                            <FormHelperText error>
                              {errors.departureLocation.message as string}
                            </FormHelperText>
                          )}
                        </FormControl>
                        <FormControl fullWidth className="mb-2">
                          <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                            Arrival
                          </FormLabel>
                          <Grid2 container spacing={2} alignItems="center">
                            <Grid2 size={4}>
                              <DatePicker
                                slotProps={{
                                  field: {
                                    className:
                                      "text-neutral-800 text-sm border-none",
                                  },
                                }}
                                className="*:text-neutral-800 *:text-sm "
                                defaultValue={dayjs("2023-01-01")}
                              />
                            </Grid2>
                            <Grid2 size={4}>
                              <TimePicker
                                className="*:text-neutral-800 *:text-sm "
                                defaultValue={dayjs("2023-01-31")}
                              />
                            </Grid2>
                            <Grid2 size={4}>
                              <TextField
                                slotProps={{
                                  htmlInput: {
                                    className:
                                      "text-neutral-800 text-sm border-none no-underline  rounded-md p-2",
                                  },
                                }}
                                variant="standard"
                                inputMode="text"
                                {...register("departureLocation", {
                                  required: "Departure location is required",
                                })}
                                placeholder="Location"
                              />
                            </Grid2>
                          </Grid2>
                          {errors.departureLocation && (
                            <FormHelperText error>
                              {errors.departureLocation.message as string}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid2>

                      <Grid2 size={{ lg: 4 }}>
                        <FormControl fullWidth className="mb-2 w-full">
                          <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                            Cost
                          </FormLabel>
                          <div className="flex border border-neutral-300 inset-shadow-sm/50 bg-gray-50 rounded-md p-2 w-full text-neutral-800 text-base border-none no-underline inset-shadow-sm inset-shadow-gray-300">
                            <IconButton
                              aria-label="menu"
                              size="small"
                              onClick={handleClick}
                            >
                              <CurrencyExchange />
                            </IconButton>
                            <Menu
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                            >
                              <MenuItem>
                                <ListItemIcon>
                                  <CurrencyExchange />
                                </ListItemIcon>
                                <ListItemText primary="USD" />
                              </MenuItem>
                              <MenuItem>
                                <ListItemIcon>
                                  <CurrencyExchange />
                                </ListItemIcon>
                                <ListItemText primary="EUR" />
                              </MenuItem>
                              <MenuItem>
                                <ListItemIcon>
                                  <CurrencyExchange />
                                </ListItemIcon>
                                <ListItemText primary="VND" />
                              </MenuItem>
                            </Menu>
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              inputProps={{
                                className:
                                  "text-neutral-800 text-base border-none",
                              }}
                            />
                          </div>
                          {errors.mode && (
                            <FormHelperText error>
                              {errors?.root?.server && "Server error"}
                            </FormHelperText>
                          )}
                        </FormControl>
                        <FormControl fullWidth className="mb-2 w-full">
                          <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                            Note
                          </FormLabel>
                          <div className="border border-neutral-300 inset-shadow-sm/50 bg-gray-50 rounded-md p-2 w-full text-neutral-800 text-base border-none no-underline inset-shadow-sm inset-shadow-gray-300">
                            <InputBase
                              multiline
                              rows={4}
                              inputProps={{
                                className:
                                  "text-neutral-800 text-base border-none",
                              }}
                            />
                          </div>
                          {errors.mode && (
                            <FormHelperText error>
                              {errors?.root?.server && "Server error"}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid2>
                    </Grid2>
                  </form>
                </CardContent>
              </Card>
              {/* Repeat Card for more notes */}
              <Card className="w-full flex rounded-xl bg-blue-50 border border-blue-200 flex-col p-2 px-4">
                <CardContent className="py-2">
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ lg: 8 }}>
                      <Stack direction={"row"} alignItems={"center"} gap={2}>
                        <Stack direction={"column"}>
                          <h1 className="text-lg font-bold">LAS</h1>
                          <p className="text-neutral-600 text-sm">Las Vegas</p>
                        </Stack>
                        <ArrowForward className="text-neutral-700 text-3xl" />
                        <Stack direction={"column"}>
                          <h1 className="text-lg font-bold">LAS</h1>
                          <p className="text-neutral-600 text-sm">Las Vegas</p>
                        </Stack>
                      </Stack>
                      <Stack>
                        <Stack
                          direction={"row"}
                          className="py-2"
                          gap={1}
                          alignItems={"center"}
                        >
                          <time>Tue, 24 Jun</time>
                          <Circle className="text-xs" />
                          <span>10:00 AM - 12:04 AM</span>
                        </Stack>
                        <data
                          value="airport"
                          className="font-mono text-sm text-gray-600 font-semibold"
                        >
                          21 AIR 21 12312
                        </data>
                        {/* or bus number */}
                      </Stack>
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={{ lg: 3 }}>
                      <Stack className="mb-2">
                        <h1 className="text-sm font-semibold text-neutral-700 uppercase">
                          Cost
                        </h1>
                        <Chip
                          label="$100"
                          className="bg-gray-200 font-semibold text-base w-fit justify-start text-gray-800"
                        />
                      </Stack>
                      <Stack>
                        <h1 className="text-sm font-semibold text-neutral-700 uppercase">
                          Notes
                        </h1>
                        <Tooltip title="This is a note about the transit. It can contain any information you want to remember.">
                          <p className="line-clamp-2 text-sm">
                            This is a note about the transit. It can contain any
                            information you want to remember.
                          </p>
                        </Tooltip>
                      </Stack>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>

              {/* Places to Visit Section */}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <Divider textAlign="left">
        <Chip
          icon={<Explore />}
          label="Places to Visit"
          className="font-semibold"
        />
      </Divider>
      <div>
        <Accordion
          elevation={0}
          className="bg-white py-4"
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            className="group"
            id="panel1bh-header"
          >
            <Badge badgeContent={4} color="success">
              <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
                Places
              </h1>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-4">
              {/* Places to Visit Section */}
              <Card
                elevation={0}
                className="w-full grid lg:grid-cols-3 rounded-xl lg:min-h-64 flex-col p-2 px-4"
              >
                <CardMedia
                  component="img"
                  src="/images/ocean-beach-mountains-ud.jpg"
                  className="object-cover col-span-1 w-full h-full rounded-s-lg"
                />
                <CardContent className="p-0 px-4 lg:py-1 gap-4 flex flex-col col-span-2">
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={2}
                    justifyContent={"space-between"}
                  >
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      <h1 className="text-2xl font-semibold">Title</h1>
                      <Chip
                        label="Category"
                        size="small"
                        className="bg-white border border-neutral-500 font-medium"
                      />
                    </Stack>
                    <IconButton className="p-1">
                      <MoreHoriz />
                    </IconButton>
                  </Stack>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <Stack direction={"row"} alignItems={"baseline"}>
                      <Star className="text-yellow-500 text-base " />
                      <span className="text-base text-gray-600 font-semibold ml-1">
                        4.5
                      </span>
                      <span className="text-xs text-gray-600 ">
                        (1247 reviews)
                      </span>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                      <AccessTime className="text-gray-600 text-base mr-0.5" />
                      <span className="text-sm text-gray-600">
                        10:00 AM - 6:00 PM
                      </span>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                      <AttachMoney className="text-green-600 text-base" />
                      <span className="text-sm text-gray-600 font-semibold">
                        Free
                      </span>
                    </Stack>
                  </Stack>
                  {/* <p className="text-base text-neutral-800 text-ellipsis line-clamp-3">
                  Moderate hiking trail leading to a secluded black sand
                  beach with dramatic coastal views.
                </p> */}
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Add a description..."
                    variant="standard"
                    size="small"
                    slotProps={{
                      input: {
                        className:
                          "text-neutral-800 text-sm border-none no-underline",
                      },
                    }}
                  />
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={1}
                    flexWrap={"wrap"}
                  >
                    <Chip label="Category" size="small" className="text-xs" />
                    <Chip label="Category" size="small" className="text-xs" />
                    <Chip label="Category" size="small" className="text-xs" />
                  </Stack>
                  <Divider className="" />
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      <TaskAlt className="text-lg" />
                      <Chip
                        className="bg-green-200  text-green-800 font-medium"
                        label="Visited"
                        size="small"
                      />
                    </Stack>
                    <ButtonGroup>
                      <Button
                        variant="outlined"
                        className="text-gray-600 border-gray-300"
                        startIcon={<Directions />}
                      >
                        Directions
                      </Button>
                      <Button
                        variant="contained"
                        className="bg-gray-800 text-white"
                        startIcon={<OpenInNew />}
                      >
                        Details
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </section>
  );
};

export default Reservation;
