import {
  Add,
  ArrowForward,
  Circle,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Search,
} from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  IconButton,
  InputAdornment,
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
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useSocket } from "../../../../../../../services/context/socketContext";
import { TransitData } from "../../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { useAutocompleteSuggestions } from "../../../../../../../utils/hooks/use-autocomplete-suggestion";

interface ReservationCardsProps {
  index?: number;
  data: TransitData;

  onToggleEdit: (id: string) => void;
}

const EditableTransitCards: React.FC<ReservationCardsProps> = (props) => {
  const { socket } = useSocket();
  const [departureValue, setDepartureValue] = useState(
    props.data.departure.location
  );
  const [arrivalValue, setArrivalValue] = useState(props.data.arrival.location);

  const [departureOpen, setDepartureOpen] = useState(false);
  const [arrivalOpen, setArrivalOpen] = useState(false);

  const [selectedDeparturePlace, setSelectedDeparturePlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);

  const [selectedArrivalPlace, setSelectedArrivalPlace] = useState<{
    placePrediction: google.maps.places.PlacePrediction;
  } | null>(null);

  const { suggestions: departureSuggestions, isLoading: isDepartureLoading } =
    useAutocompleteSuggestions(departureValue, {
      includedPrimaryTypes: [
        "transit_station",
        "airport",
        "train_station",
        "bus_station",
        "taxi_stand",
      ],
    });

  const { suggestions: arrivalSuggestions, isLoading: isArrivalLoading } =
    useAutocompleteSuggestions(arrivalValue, {
      includedPrimaryTypes: [
        "transit_station",
        "airport",
        "train_station",
        "bus_station",
        "taxi_stand",
      ],
    });

  const handleDepartureInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDepartureValue(event.target.value);
  };

  const handleArrivalInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArrivalValue(event.target.value);
  };

  // Handle departure place selection
  const handleDepartureSelect = (
    suggestion: {
      placePrediction: google.maps.places.PlacePrediction | null;
    } | null
  ) => {
    if (suggestion?.placePrediction) {
      setSelectedDeparturePlace({
        placePrediction: suggestion.placePrediction,
      });
      setDepartureValue(suggestion.placePrediction.mainText + "");
      setDepartureOpen(false);
    }
  };

  // Handle arrival place selection
  const handleArrivalSelect = (
    suggestion: {
      placePrediction: google.maps.places.PlacePrediction | null;
    } | null
  ) => {
    if (suggestion?.placePrediction) {
      setSelectedArrivalPlace({ placePrediction: suggestion.placePrediction });
      setArrivalValue(suggestion.placePrediction.mainText + "");
      setArrivalOpen(false);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    watch,
  } = useForm({
    defaultValues: {
      mode: props.data?.mode,
      departureLocation: props.data.departure?.location,
      arrivalLocation: props.data.arrival?.location,
      departureDateTime: dayjs(props.data.departure?.datetime),
      arrivalDateTime: dayjs(props.data.arrival?.datetime),
      cost: props.data?.cost,
      note: props.data?.note,
      currency: props.data?.currency || "$",
    },
  });
  const onFormSubmit = (data: any) => {
    const updated: TransitData = {
      id: props.data.id,
      note: data.note,
      cost: Number(data.cost),
      mode: data.mode,
      departure: {
        location: data.departureLocation,
        datetime: data.departureDateTime,
      },
      arrival: {
        location: data.arrivalLocation,
        datetime: data.arrivalDateTime,
      },
      currency: data.currency || "$",
    };
    socket?.emit("planItemUpdated", {
      section: "transits",
      item: updated,
    });
    props.onToggleEdit(props.data.id || "");
  };

  return (
    <Card
      elevation={0}
      className="w-full flex rounded-xl bg-white shadow-md border border-gray-300 flex-col p-2 px-4"
    >
      <CardContent className="p-0 lg:py-1 gap-4 flex flex-col justify-between">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={2} justifyContent={"space-between"}>
            <Stack direction="row" justifyContent="space-between">
              <FormControl fullWidth className="mb-2">
                <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                  Mode
                </FormLabel>
                <Controller
                  name="mode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="standard"
                      slotProps={{
                        input: {
                          className:
                            "text-neutral-800 text-base border-none no-underline",
                        },
                      }}
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
                  )}
                />
                {errors.mode && (
                  <FormHelperText error>Mode is required</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth className="mb-2 w-full">
                <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                  Cost
                </FormLabel>
                <div className="flex border  rounded-md p-2 w-full text-neutral-800 text-base border-none no-underline ">
                  <Controller
                    name="cost"
                    control={control}
                    rules={{ required: "Cost is required" }}
                    render={({ field }) => (
                      <NumericFormat
                        {...register("cost", {
                          required: "Cost is required",
                          valueAsNumber: true,
                        })}
                        slotProps={{
                          input: {
                            size: "small",

                            startAdornment: (
                              <InputAdornment position="start">
                                <Select
                                  {...register("currency", {
                                    required: "Currency is required",
                                  })}
                                  variant="standard"
                                  disableUnderline
                                  slotProps={{
                                    input: {
                                      className:
                                        "text-neutral-800 text-base border-none no-underline",
                                    },
                                  }}
                                  className="text-neutral-800 text-base border-none no-underline"
                                  defaultValue="$"
                                >
                                  <MenuItem value="$">$</MenuItem>
                                  <MenuItem value="€">€</MenuItem>
                                  <MenuItem value="£">£</MenuItem>
                                  <MenuItem value="¥">¥</MenuItem>
                                  <MenuItem value="₫">₫</MenuItem>
                                </Select>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography variant="body2">
                                  {watch("currency", "$")} (
                                  {watch("currency", "$") === "$"
                                    ? "USD"
                                    : watch("currency", "$") === "€"
                                    ? "EUR"
                                    : watch("currency", "$") === "£"
                                    ? "GBP"
                                    : watch("currency", "$") === "¥"
                                    ? "JPY"
                                    : watch("currency", "$") === "₫"
                                    ? "VND"
                                    : ""}
                                  )
                                </Typography>
                              </InputAdornment>
                            ),
                          },
                        }}
                        {...field}
                        className="text-neutral-800 text-base border-none w-full "
                        customInput={TextField}
                      />
                    )}
                  />
                </div>
                {errors.cost && (
                  <FormHelperText error>
                    {errors.cost.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack className="grid grid-cols-2" direction="row" spacing={1}>
              <Stack direction="column" spacing={2} className="w-full">
                <FormControl fullWidth>
                  <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                    Departed At
                  </FormLabel>
                  <Stack>
                    <Controller
                      name="departureDateTime"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          slotProps={{
                            field: {
                              className: "text-neutral-800 text-sm border-none",
                            },
                          }}
                          className="*:text-neutral-800 *:text-sm"
                        />
                      )}
                    />
                    {errors.departureDateTime && (
                      <FormHelperText error>
                        {errors.departureDateTime.message as string}
                      </FormHelperText>
                    )}
                  </Stack>
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name="departureLocation"
                    control={control}
                    rules={{ required: "Departure location is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        id="departure-autocomplete"
                        open={departureOpen}
                        onOpen={() => {
                          if (departureValue.length >= 2)
                            setDepartureOpen(true);
                        }}
                        onClose={() => setDepartureOpen(false)}
                        isOptionEqualToValue={(option, value) =>
                          option.placePrediction?.placeId ===
                          value.placePrediction?.placeId
                        }
                        getOptionLabel={(option) =>
                          option.placePrediction?.mainText + ""
                        }
                        options={departureSuggestions}
                        loading={isDepartureLoading}
                        value={selectedDeparturePlace}
                        onChange={(_, newValue) => {
                          handleDepartureSelect(newValue);
                          if (newValue?.placePrediction) {
                            field.onChange(
                              newValue.placePrediction.mainText + ""
                            );
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            value={departureValue}
                            className=""
                            size="small"
                            fullWidth
                            placeholder="Enter departure location"
                            variant="outlined"
                            onChange={(e) => {
                              handleDepartureInputChange(e);
                              field.onChange(e.target.value);
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {isDepartureLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.placePrediction?.placeId}>
                            <Stack>
                              <div className="font-medium">
                                {option?.placePrediction?.mainText + ""}
                              </div>
                              <div className="text-sm text-gray-500">
                                {option.placePrediction?.secondaryText != null
                                  ? option.placePrediction?.secondaryText + ""
                                  : option.placePrediction?.text + ""}
                              </div>
                            </Stack>
                          </li>
                        )}
                      />
                    )}
                  />
                  {errors.departureLocation && (
                    <FormHelperText error>
                      {errors.departureLocation.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction={"column"} spacing={2}>
                <FormControl fullWidth>
                  <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                    Arrived At
                  </FormLabel>
                  <Controller
                    name="arrivalDateTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        slotProps={{
                          field: {
                            className: "text-neutral-800 text-sm border-none",
                          },
                        }}
                        className="*:text-neutral-800 *:text-sm"
                      />
                    )}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name="arrivalLocation"
                    control={control}
                    rules={{ required: "Arrival location is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        id="arrival-autocomplete"
                        open={arrivalOpen}
                        onOpen={() => {
                          if (arrivalValue.length >= 2) setArrivalOpen(true);
                        }}
                        onClose={() => setArrivalOpen(false)}
                        isOptionEqualToValue={(option, value) =>
                          option.placePrediction?.placeId ===
                          value.placePrediction?.placeId
                        }
                        getOptionLabel={(option) =>
                          option.placePrediction?.mainText + ""
                        }
                        options={arrivalSuggestions}
                        loading={isArrivalLoading}
                        value={selectedArrivalPlace}
                        onChange={(_, newValue) => {
                          handleArrivalSelect(newValue);
                          if (newValue?.placePrediction) {
                            field.onChange(
                              newValue.placePrediction.mainText + ""
                            );
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            value={arrivalValue}
                            className=""
                            size="small"
                            fullWidth
                            placeholder="e.g Ta xua, Sapa, Da Nang"
                            variant="outlined"
                            onChange={(e) => {
                              handleArrivalInputChange(e);
                              field.onChange(e.target.value);
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {isArrivalLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.placePrediction?.placeId}>
                            <Stack>
                              <div className="font-medium">
                                {option?.placePrediction?.mainText + ""}
                              </div>
                              <div className="text-sm text-gray-500">
                                {option.placePrediction?.secondaryText != null
                                  ? option.placePrediction?.secondaryText + ""
                                  : option.placePrediction?.text + ""}
                              </div>
                            </Stack>
                          </li>
                        )}
                      />
                    )}
                  />
                  {errors.arrivalLocation && (
                    <FormHelperText error>
                      {errors.arrivalLocation.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            className="grid grid-cols-3"
            direction="row"
            alignItems={"flex-end"}
            marginTop={2}
            gap={1}
          >
            <FormControl fullWidth className="lg:col-span-2 w-full">
              <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                Note
              </FormLabel>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    fullWidth
                    rows={2}
                    slotProps={{
                      input: {
                        className:
                          "text-neutral-800 text-base border-none w-full h-full",
                      },
                    }}
                  />
                )}
              />
            </FormControl>
            <ButtonGroup className="col-span-1 flex justify-end h-fit items-end">
              <Button
                variant="outlined"
                type="button"
                color="error"
                onClick={() => props.onToggleEdit(props.data.id || "")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

const TransitCards: React.FC<ReservationCardsProps> = (props) => {
  if (props.data.isEditing) {
    return <EditableTransitCards {...props} />;
  }
  const { socket } = useSocket();

  const { data } = props;
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );

    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };
  const handleDelete = () => {
    socket?.emit("planItemDeleted", {
      section: "transits",
      itemId: props.data.id,
    });
  };
  const handleClose = () => {
    setContextMenu(null);
  };
  return (
    <Tooltip title="Right click for options" arrow>
      <Card
        onContextMenu={handleContextMenu}
        style={{ cursor: "context-menu" }}
        className="w-full flex rounded-xl bg-blue-50 border border-blue-200 flex-col p-2 px-4"
      >
        <CardContent className="py-2">
          <Grid2 container spacing={2}>
            <Grid2 size={{ lg: 8 }}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Stack direction={"column"}>
                  <h1 className="text-lg font-bold">
                    {data.departure?.location.split(" - ")[0]}
                  </h1>
                  <p className="text-neutral-600 text-sm">
                    {data.departure?.location.split(" - ")[1] || ""}
                  </p>
                </Stack>
                <ArrowForward className="text-neutral-700 text-3xl" />
                <Stack direction={"column"}>
                  <h1 className="text-lg font-bold">
                    {data.arrival?.location.split(" - ")[0]}
                  </h1>
                  <p className="text-neutral-600 text-sm">
                    {data.arrival?.location.split(" - ")[1] || ""}
                  </p>
                </Stack>
              </Stack>
              <Stack>
                <Stack
                  direction={"row"}
                  className="py-2"
                  gap={1}
                  alignItems={"center"}
                >
                  <time>
                    {dayjs(data.departure?.datetime).format("ddd, D MMM")} -{" "}
                    {dayjs(data.departure?.datetime, "HH:mm:ss").format(
                      "h:mm A"
                    )}
                  </time>
                  <Circle className="text-xs" />
                  <span>
                    {dayjs(data.arrival?.datetime).format("ddd, D MMM")} -
                    {dayjs(data.arrival?.datetime, "HH:mm:ss").format("h:mm A")}
                  </span>
                </Stack>
                <div className="flex items-center gap-2">
                  <Chip
                    label={data.mode}
                    size="small"
                    className="bg-blue-100 text-blue-800"
                  />
                  <span className="font-mono text-sm text-gray-600 font-semibold">
                    {data?.id}
                  </span>
                </div>
              </Stack>
            </Grid2>
            <Divider orientation="vertical" flexItem />
            <Grid2 size={{ lg: 3 }}>
              <Stack className="mb-2">
                <h1 className="text-sm font-semibold text-neutral-700 uppercase">
                  Cost
                </h1>
                <Chip
                  label={`${data?.currency || "$"}${data?.cost}`}
                  className="bg-gray-200 font-semibold text-base w-fit justify-start text-gray-800"
                />
              </Stack>
              <Stack>
                <h1 className="text-sm font-semibold text-neutral-700 uppercase">
                  Notes
                </h1>
                <Tooltip title={data.note || "No notes available"}>
                  <p className="line-clamp-2 text-sm">
                    {data.note || "No notes available"}
                  </p>
                </Tooltip>
              </Stack>
            </Grid2>
            <Menu
              open={contextMenu !== null}
              className="w-100"
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
              }
            >
              <MenuList>
                <MenuItem onClick={() => props.onToggleEdit(data?.id || "")}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </Grid2>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

const ReservationTransits: React.FC = () => {
  const { transits, toggleEditTransit } = useTripDetailStore();

  const [expanded, setExpanded] = useState(false);

  const { socket } = useSocket();
  const handleAddTransit = () => {
    const newTransit: TransitData = {
      id: "",
      note: "",
      cost: 0,
      currency: "$",
      mode: "Flight",
      departure: {
        datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        location: "",
      },
      arrival: {
        datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        location: "",
      },
      isEditing: true,
    };
    socket?.emit("planItemAdded", {
      section: "transits",
      item: {
        content: newTransit,
      },
    });
  };

  return (
    <div className="bg-white py-4 rounded" id="transits">
      <div
        className="flex items-center justify-between cursor-pointer p-4"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Badge badgeContent={transits.length} color="primary">
          <h1 className="text-3xl font-bold text-neutral-900 hover:underline">
            Transits
          </h1>
        </Badge>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 pt-4"
          >
            <div className="flex flex-col gap-4">
              {transits.map((transit, index) => (
                <TransitCards
                  key={transit.id}
                  data={transit}
                  index={index + 1}
                  onToggleEdit={toggleEditTransit}
                />
              ))}

              <Divider textAlign="right">
                <Button
                  endIcon={<Add />}
                  className="text-dark-900"
                  onClick={handleAddTransit}
                >
                  Add more Transit
                </Button>
              </Divider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationTransits;
