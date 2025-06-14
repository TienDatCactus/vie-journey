import {
  Add,
  ArrowForward,
  AttachMoney,
  Circle,
  Delete,
  Edit,
  ExpandMore,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
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
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";

interface TransitData {
  id: string;
  note: string;
  cost: number;
  currency?: string;
  mode:
    | "Train"
    | "Flight"
    | "Car"
    | "Bus"
    | "Boat"
    | "Walk"
    | "Bike"
    | "Others";
  departure: {
    date: string; // ISO date string
    time: string; // ISO time string
    location: string;
  };
  arrival: {
    date: string; // ISO date string
    time: string; // ISO time string
    location: string;
  };
  isEditing?: boolean;
}

interface ReservationCardsProps {
  index?: number;
  data: TransitData;
  onUpdate: (id: string, transit: TransitData) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EditableTransitCards: React.FC<ReservationCardsProps> = (props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      mode: props.data.mode,
      departureLocation: props.data.departure.location,
      arrivalLocation: props.data.arrival.location,
      departureDate: dayjs(props.data.departure.date),
      departureTime: dayjs(props.data.departure.time),
      arrivalDate: dayjs(props.data.arrival.date),
      arrivalTime: dayjs(props.data.arrival.time),
      cost: props.data.cost,
      note: props.data.note,
    },
  });
  // const placesLib = useMapsLibrary("places");
  // const [destination, setDestination] = useState<string>("");
  // const [selectedPlace, setSelectedPlace] = useState<{
  //   placePrediction: google.maps.places.PlacePrediction;
  // } | null>(null);
  // const [open, setOpen] = useState(false);
  // const { suggestions, isLoading } = useAutocompleteSuggestions(destination, {
  //   includedPrimaryTypes: ["point_of_interest"],
  // });

  // const handleInputChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //     const value = event.target.value;
  //     setDestination(value);
  //   },
  //   []
  // );

  // const handlePlaceSelect = (
  //   suggestion: {
  //     placePrediction: google.maps.places.PlacePrediction | null;
  //   } | null
  // ) => {
  //   if (suggestion?.placePrediction && placesLib) {
  //     setSelectedPlace({ placePrediction: suggestion.placePrediction });
  //     console.log("Selected Place:", suggestion.placePrediction.placeId);

  //     const placeId = suggestion.placePrediction.placeId || "";
  //     const name = String(suggestion.placePrediction.mainText || "");
  //     if (placeId) {
  //       onAddPlace(placeId, name);
  //     }

  //     setDestination("");
  //     setSelectedPlace(null);
  //     setOpen(false);
  //   }
  // };
  const onFormSubmit = (data: any) => {
    const updated: TransitData = {
      ...props.data,
      note: data.note,
      cost: Number(data.cost),
      mode: data.mode,
      departure: {
        location: data.departureLocation,
        date: data.departureDate,
        time: data.departureTime,
      },
      arrival: {
        location: data.arrivalLocation,
        date: data.arrivalDate,
        time: data.arrivalTime,
      },
    };

    props.onUpdate(props.data.id, updated);
    props.onToggleEdit(props.data.id);
  };

  return (
    <Card
      elevation={0}
      className="w-full flex rounded-xl bg-white shadow-md border border-gray-300 flex-col p-2 px-4"
    >
      <CardContent className="p-0 lg:py-1 gap-4 flex flex-col justify-between">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid2 container spacing={2} justifyContent={"space-between"}>
            <Grid2
              size={{
                lg: 6,
              }}
            >
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
                      size="small"
                      slotProps={{
                        input: {
                          className:
                            "text-neutral-800 text-sm border-none no-underline",
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

              <FormControl fullWidth className="mb-2">
                <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                  Departure
                </FormLabel>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={6}>
                    <Controller
                      name="departureDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
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
                  </Grid2>
                  <Grid2 size={6}>
                    <Controller
                      name="departureTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          className="*:text-neutral-800 *:text-sm"
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <Controller
                      name="departureLocation"
                      control={control}
                      rules={{ required: "Location required" }}
                      render={({ field }) => <TextField fullWidth />}
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
                  <Grid2 size={6}>
                    <Controller
                      name="arrivalDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
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
                  </Grid2>
                  <Grid2 size={6}>
                    <Controller
                      name="arrivalTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          className="*:text-neutral-800 *:text-sm"
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <Controller
                      name="arrivalLocation"
                      control={control}
                      rules={{ required: "Location required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={!!errors.arrivalLocation}
                          variant="standard"
                          placeholder="Location"
                          fullWidth
                        />
                      )}
                    />
                  </Grid2>
                </Grid2>
                {errors.arrivalLocation && (
                  <FormHelperText error>
                    {errors.arrivalLocation.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 6 }}>
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoney />
                              </InputAdornment>
                            ),
                          },
                        }}
                        {...field}
                        className="text-neutral-800 text-base border-none w-full h-full"
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

              <FormControl fullWidth className="mb-2 w-full">
                <FormLabel className="text-sm font-semibold text-neutral-700 uppercase">
                  Note
                </FormLabel>
                <div className="border rounded-md p-2 w-full text-neutral-800  text-base border-none ">
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        fullWidth
                        rows={8}
                        maxRows={8}
                        slotProps={{
                          input: {
                            className:
                              "text-neutral-800 text-base border-none w-full h-full",
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </FormControl>
            </Grid2>
          </Grid2>

          <Stack
            direction="row"
            justifyContent="flex-end"
            marginTop={2}
            gap={1}
          >
            <Button
              variant="outlined"
              type="button"
              color="error"
              onClick={() => props.onToggleEdit(props.data.id)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
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
                    {data.departure.location.split(" - ")[0]}
                  </h1>
                  <p className="text-neutral-600 text-sm">
                    {data.departure.location.split(" - ")[1] || ""}
                  </p>
                </Stack>
                <ArrowForward className="text-neutral-700 text-3xl" />
                <Stack direction={"column"}>
                  <h1 className="text-lg font-bold">
                    {data.arrival.location.split(" - ")[0]}
                  </h1>
                  <p className="text-neutral-600 text-sm">
                    {data.arrival.location.split(" - ")[1] || ""}
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
                  <time>{dayjs(data.departure.date).format("ddd, D MMM")}</time>
                  <Circle className="text-xs" />
                  <span>
                    {dayjs(data.departure.time, "HH:mm:ss").format("h:mm A")} -
                    {dayjs(data.arrival.time, "HH:mm:ss").format("h:mm A")}
                  </span>
                </Stack>
                <div className="flex items-center gap-2">
                  <Chip
                    label={data.mode}
                    size="small"
                    className="bg-blue-100 text-blue-800"
                  />
                  <span className="font-mono text-sm text-gray-600 font-semibold">
                    {data.id}
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
                  label={`${data.currency || "$"}${data.cost}`}
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
                <MenuItem onClick={() => props.onToggleEdit(data.id)}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => props.onDelete(data.id)}>
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
  const {
    transits,
    addTransit,
    updateTransit,
    toggleEditTransit,
    deleteTransit,
  } = useTripDetailStore();

  const handleAddTransit = () => {
    const newTransit: TransitData = {
      id: `transit-${Date.now()}`,
      note: "",
      cost: 0,
      currency: "USD",
      mode: "Flight",
      departure: {
        date: dayjs().format("YYYY-MM-DD"),
        time: dayjs().format("HH:mm:ss"),
        location: "",
      },
      arrival: {
        date: dayjs().format("YYYY-MM-DD"),
        time: dayjs().add(2, "hour").format("HH:mm:ss"),
        location: "",
      },
      isEditing: true,
    };

    addTransit(newTransit);
  };

  return (
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
          <Badge badgeContent={transits.length} color="primary">
            <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
              Transits
            </h1>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-4">
            {transits.map((transit, index) => (
              <TransitCards
                key={transit.id}
                data={transit}
                index={index + 1}
                onUpdate={updateTransit}
                onToggleEdit={toggleEditTransit}
                onDelete={deleteTransit}
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReservationTransits;
