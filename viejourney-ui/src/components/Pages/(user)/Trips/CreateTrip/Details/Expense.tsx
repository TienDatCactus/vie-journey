import {
  AddLink,
  AttachMoney,
  BorderColor,
  CameraAlt,
  Clear,
  Close,
  Delete,
  Description,
  DirectionsCar,
  Edit,
  FlightTakeoff,
  GroupAdd,
  Hotel,
  Insights,
  LocalBar,
  LocalGasStation,
  LocalGroceryStore,
  MoreHoriz,
  PriceCheck,
  ReceiptLong,
  Restaurant,
  SettingsEthernet,
  ShoppingCart,
  SportsEsports,
  Train,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { doInviteTripMate } from "../../../../../../services/api";
import { useSocket } from "../../../../../../services/context/socketContext";
import { Expense } from "../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import { formatCurrency } from "../../../../../../utils/handlers/utils";
import { useExpenseInsights } from "../../../../../../utils/hooks/useExpenseInsights";

const expenseColumns: GridColDef[] = [
  {
    field: "type",
    headerName: "Type",
    width: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const iconMap = {
        Flights: <FlightTakeoff />,
        Lodging: <Hotel />,
        "Car rental": <DirectionsCar />,
        Transit: <Train />,
        Food: <Restaurant />,
        Drinks: <LocalBar />,
        Sightseeing: <CameraAlt />,
        Activities: <SportsEsports />,
        Shopping: <ShoppingCart />,
        Gas: <LocalGasStation />,
        Groceries: <LocalGroceryStore />,
        Other: <MoreHoriz />,
      };

      return (
        <Tooltip title={params.value || "Other"}>
          <div className="flex w-full items-center justify-center h-full">
            {iconMap[params.value as keyof typeof iconMap] || iconMap.Other}
          </div>
        </Tooltip>
      );
    },
  },
  {
    field: "desc",
    headerName: "Description",
    flex: 1,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value || ""}>
          <p className="truncate font-semibold ">{params.value}</p>
        </Tooltip>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    renderCell: (params) => (
      <Tooltip
        title={
          <div>
            <p>{formatCurrency(params.value, "en-US")}</p>
            <p>Paid by: {params.row.payer}</p>
          </div>
        }
      >
        <p className="font-serif truncate">
          {formatCurrency(params.value, "en-US")}
        </p>
      </Tooltip>
    ),
  },
  {
    field: "splits",
    headerName: "Split",
    flex: 1,
    cellClassName: "flex items-center",
    sortable: false,
    renderCell: (params) => {
      const splitWith = params.row.splits?.splitWith || [];
      const totalPeople = splitWith.length;

      const content = `${totalPeople} person${
        totalPeople > 1 ? "s" : ""
      } split`;

      return (
        <Tooltip title={splitWith.join(", ") || "No splits"}>
          <p className="truncate max-w-full text-sm text-gray-700">{content}</p>
        </Tooltip>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 80,
    sortable: false,
    renderCell: (params) => {
      return (
        <div className="flex h-full items-center justify-center gap-2">
          <Tooltip title="Edit">
            <EditExpenseDialog expense={params.row} inTable={true} />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteExpenseDialog expenseId={params.row.id} />
          </Tooltip>
        </div>
      );
    },
  },
];

const expenseTypes = [
  {
    label: "Flights",
    value: "Flights",
    icon: <FlightTakeoff />,
  },
  {
    label: "Lodging",
    value: "Lodging",
    icon: <Hotel />,
  },
  {
    label: "Car rental",
    value: "Car rental",
    icon: <DirectionsCar />,
  },
  {
    label: "Transit",
    value: "Transit",
    icon: <Train />,
  },
  {
    label: "Food",
    value: "Food",
    icon: <Restaurant />,
  },
  {
    label: "Drinks",
    value: "Drinks",
    icon: <LocalBar />,
  },
  {
    label: "Sightseeing",
    value: "Sightseeing",
    icon: <CameraAlt />,
  },
  {
    label: "Activities",
    value: "Activities",
    icon: <SportsEsports />,
  },
  {
    label: "Shopping",
    value: "Shopping",
    icon: <ShoppingCart />,
  },
  {
    label: "Gas",
    value: "Gas",
    icon: <LocalGasStation />,
  },
  {
    label: "Groceries",
    value: "Groceries",
    icon: <LocalGroceryStore />,
  },
  {
    label: "Other",
    value: "Other",
    icon: <MoreHoriz />,
  },
];

const DeleteExpenseDialog: React.FC<{
  expenseId: string;
}> = ({ expenseId }) => {
  const { socket } = useSocket();
  const handleDelete = () => {
    socket?.emit("planItemDeleted", {
      section: "expenses",
      itemId: expenseId,
    });
  };
  return (
    <IconButton size="small" onClick={handleDelete}>
      <Delete fontSize="small" className="text-gray-500" />
    </IconButton>
  );
};
const EditExpenseDialog: React.FC<{
  expense?: Expense | null;
  inTable?: boolean;
}> = ({ expense, inTable = false }) => {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<Expense>({
    defaultValues: {
      amount: expense?.amount || 0,
      type: expense?.type,
      desc: expense?.desc || "",
      payer: expense?.payer || "",
      splits: {
        splitWith: expense?.splits?.splitWith || [],
      },
    },
  });
  useEffect(() => {
    reset({
      amount: expense?.amount || 0,
      type: expense?.type || "Other",
      desc: expense?.desc || "",
      payer: expense?.payer || "",
      splits: {
        splitWith: expense?.splits?.splitWith || [],
      },
    });
  }, [expense, reset]);
  const { trip, totalBudget } = useTripDetailStore();
  const { socket } = useSocket();
  const onSubmit: SubmitHandler<Expense> = (data) => {
    try {
      const description =
        data.desc && data.desc.length > 0 ? data.desc : `${data.type} expense`;
      const expenseData: Expense = {
        ...data,
        desc: description,
        splits: {
          splitWith: data.splits?.splitWith ?? [],
          amount: data.amount,
          isSettled: false,
        },
      };

      if (expense?.id) {
        socket?.emit("planItemUpdated", {
          section: "expenses",
          item: {
            id: expense.id,
            ...expenseData,
          },
        });
      } else {
        socket?.emit("planItemAdded", {
          section: "expenses",
          item: expenseData,
        });
      }

      setOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {inTable ? (
        <IconButton size="small" onClick={handleClickOpen}>
          <Edit fontSize="small" className="text-gray-500" />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          disabled={totalBudget <= 0}
          onClick={handleClickOpen}
          startIcon={<PriceCheck />}
        >
          {totalBudget ? "Add expense" : "Set your budget first"}
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            className: "rounded-2xl p-4",
          },
        }}
        aria-labelledby="add-expense-dialog-title"
      >
        <DialogTitle
          id="add-expense-dialog-title "
          className="text-2xl font-semibold"
        >
          {expense?.id ? "Edit Expense" : "Add New Expense"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                id="amount"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  },
                }}
                label="Amount"
                value={watch("amount")}
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0,
                    message: "Amount must be a positive number",
                  },
                })}
                error={!!errors?.amount}
                helperText={errors?.amount ? errors.amount.message : ""}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="type">Type</InputLabel>
              <Controller
                control={control}
                name="type"
                defaultValue="Other"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="type"
                    label="Type"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors?.type}
                    MenuProps={{
                      className: "max-h-80 ",
                      container: () => document.body,
                      disablePortal: true,
                    }}
                    slotProps={{
                      input: {
                        className: "flex items-center space-x-2 ",
                      },
                    }}
                  >
                    {expenseTypes.map((type) => (
                      <MenuItem
                        className="space-x-2 flex items-center"
                        key={type.value}
                        value={type.value}
                      >
                        {type.icon}
                        <p>{type.label}</p>
                      </MenuItem>
                    ))}
                  </Select>
                )}
                rules={{ required: "Expense type is required" }}
              />
            </FormControl>
            {watch("type") && (
              <FormControl fullWidth>
                <Controller
                  control={control}
                  name="desc"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      rows={3}
                      multiline
                      variant="outlined"
                      id="desc"
                      label="Description"
                      error={!!errors?.desc}
                      helperText={errors?.desc?.message}
                    />
                  )}
                />
              </FormControl>
            )}
            <FormControl
              fullWidth
              className="border border-dashed rounded-lg border-gray-500 p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="payer"
                  className={`${
                    errors?.payer ? "text-red-500" : ""
                  } font-bold text-sm`}
                >
                  Paid by
                </h2>
                <Controller
                  control={control}
                  name="payer"
                  rules={{ required: "Payer is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const selected = trip.tripmates.find(
                          (m) => m === e.target.value
                        );
                        field.onChange(selected);
                      }}
                      variant="standard"
                      error={!!errors?.payer}
                      MenuProps={{
                        container: () => document.body,
                        disablePortal: true,
                      }}
                    >
                      {trip?.tripmates.map((mate) => (
                        <MenuItem key={mate} value={mate}>
                          {mate}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </FormControl>
            <div className="border border-dashed rounded-lg border-gray-500 p-4 bg-gray-50">
              <FormControl fullWidth>
                <div className="flex items-center justify-between">
                  <h2 id="split" className="font-bold text-sm">
                    Split
                  </h2>
                  <Controller
                    control={control}
                    name="splits.splitWith"
                    render={({ field }) => (
                      <Select
                        {...field}
                        slotProps={{
                          input: {
                            className: "truncate",
                          },
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        className="max-w-60"
                        value={field.value || []}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                          container: () => document.body,
                          disablePortal: true,
                        }}
                        variant="standard"
                      >
                        {Array.isArray(trip.tripmates) &&
                          trip.tripmates.map((name) => (
                            <MenuItem key={name} value={name}>
                              <ListItemIcon className="min-w-[32px]">
                                <Checkbox
                                  edge="start"
                                  checked={
                                    Array.isArray(field.value) &&
                                    field.value.includes(name)
                                  } // Use field.value and ensure it's an array
                                  tabIndex={-1}
                                  disableRipple
                                  size="small"
                                />
                              </ListItemIcon>
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </div>
              </FormControl>
              {Array.isArray(watch("splits.splitWith")) &&
                watch("splits.splitWith").length > 0 &&
                watch("amount") > 0 && (
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    {watch("splits.splitWith").map((name) => (
                      <div
                        key={name}
                        className="flex justify-between border-b border-gray-200 py-1"
                      >
                        <span>{name}</span>
                        <p>
                          {formatCurrency(
                            Number(
                              watch("amount") / watch("splits.splitWith").length
                            ),
                            "en-US"
                          )}{" "}
                          / person
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full bg-dark-800"
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const InsightsDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { expenses, totalBudget } = useTripDetailStore();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    totalSpent,
    budgetRemaining,
    budgetData,
    expenseByType,
    expensesByPerson,
    topCategories,
  } = useExpenseInsights(expenses, totalBudget);

  return (
    <React.Fragment>
      <Button
        className="justify-start"
        onClick={handleClickOpen}
        startIcon={<Insights className="text-2xl" />}
      >
        <h1 className="text-base font-semibold">Insights</h1>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="expense-insights-dialog-title"
      >
        <DialogTitle
          id="expense-insights-dialog-title"
          className="flex items-center justify-between"
        >
          <Typography variant="h5" component="span" fontWeight={600}>
            Expense Insights
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {expenses.length === 0 ? (
            <Box className="py-12 text-center">
              <ReceiptLong fontSize="large" className="text-gray-400 mb-2" />
              <Typography variant="h6">No expenses added yet</Typography>
              <Typography variant="body2" color="textSecondary">
                Add some expenses to see insights
              </Typography>
            </Box>
          ) : (
            <Box className="space-y-8">
              {/* Budget Overview Card */}
              <Paper elevation={0} className="p-4 rounded-xl bg-gray-50">
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Budget Overview
                </Typography>
                <Grid2 container spacing={2}>
                  {/* Budget Meter */}
                  <Grid2
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <Box sx={{ height: 200 }}>
                      <PieChart
                        series={[
                          {
                            arcLabel: (item) =>
                              `${((item.value / totalBudget) * 100).toFixed(
                                0
                              )}%`,
                            arcLabelMinAngle: 45,
                            data: budgetData,
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                            valueFormatter: (data) =>
                              formatCurrency(data?.value, "en-US"),
                            faded: {
                              innerRadius: 30,
                              additionalRadius: -30,
                              color: "gray",
                            },
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: "white",
                            fontWeight: "bold",
                          },
                        }}
                        height={200}
                      />
                    </Box>
                  </Grid2>

                  {/* Budget Details */}
                  <Grid2
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                    className="flex flex-col justify-center"
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Budget
                      </Typography>
                      <Typography
                        variant="h4"
                        className="font-bold text-green-700"
                      >
                        {formatCurrency(totalBudget, "en-US")}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Spent
                        </Typography>
                        <Typography
                          variant="h5"
                          className={
                            totalSpent > totalBudget
                              ? "text-red-600 font-semibold"
                              : "text-gray-800 font-semibold"
                          }
                        >
                          {formatCurrency(totalSpent, "en-US")}
                          {totalSpent > totalBudget && (
                            <span className="text-xs ml-2">
                              (
                              {((totalSpent / totalBudget - 1) * 100).toFixed(
                                0
                              )}
                              % over budget)
                            </span>
                          )}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Remaining
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-semibold"
                          sx={{ color: budgetRemaining > 0 ? "green" : "red" }}
                        >
                          {formatCurrency(budgetRemaining, "en-US")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>
                </Grid2>
              </Paper>

              {/* Spending by Category */}
              <Paper elevation={0} className="p-4 rounded-xl bg-gray-50">
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Spending by Category
                </Typography>
                <Grid2 container spacing={2}>
                  {/* Pie Chart */}
                  <Grid2 size={{ xs: 12, md: 8 }}>
                    <Box sx={{ height: 300 }}>
                      <PieChart
                        series={[
                          {
                            data: expenseByType,
                            valueFormatter: (data) =>
                              formatCurrency(data.value, "en-US"),
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                            faded: {
                              innerRadius: 30,
                              additionalRadius: -30,
                              color: "gray",
                            },
                          },
                        ]}
                        height={300}
                        hideLegend={false}
                      />
                    </Box>
                  </Grid2>

                  {/* Top Categories */}
                  <Grid2 size={{ xs: 12, md: 4 }}>
                    <Box className="h-full flex flex-col justify-center">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight={600}
                      >
                        Top Categories
                      </Typography>
                      <List dense disablePadding>
                        {topCategories.map((category) => (
                          <ListItem
                            key={category.id}
                            disableGutters
                            className="px-0"
                          >
                            <ListItemText
                              primary={
                                <Box className="flex items-center gap-2">
                                  <Box
                                    component="span"
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      bgcolor: category.color,
                                    }}
                                  />
                                  <Typography variant="body2">
                                    {category.id}
                                  </Typography>
                                </Box>
                              }
                              secondary={formatCurrency(
                                category.value,
                                "en-US"
                              )}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {((category.value / totalSpent) * 100).toFixed(1)}
                              %
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid2>
                </Grid2>
              </Paper>

              {/* Who Paid What */}
              <Paper elevation={0} className="p-4 rounded-xl bg-gray-50">
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Who Paid What
                </Typography>
                <Box sx={{ height: 300 }}>
                  <BarChart
                    dataset={expensesByPerson}
                    xAxis={[
                      {
                        data: expensesByPerson.map((item) => item.name),
                      },
                    ]}
                    series={[
                      {
                        dataKey: "amount",
                        label: "Amount Paid",
                        valueFormatter: (value) =>
                          formatCurrency(value || 0, "en-US"),
                      },
                    ]}
                    height={300}
                    margin={{ bottom: 70, left: 70, right: 20 }}
                    hideLegend={true}
                  />
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const AddTripmateDialog = () => {
  const trip = useTripDetailStore((state) => state.trip);
  const { addTripmate, handleRemoveTripMate } = useTripDetailStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    tripmateEmail: "",
  });

  const handleDeleteTripmate = async (tripmateEmail: string) => {
    console.log("Deleting tripmate:", tripmateEmail);
    try {
      setLoading(true);
      await handleRemoveTripMate(tripmateEmail);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setOpenDeleteDialog({ open: false, tripmateEmail: "" });
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog({ open: false, tripmateEmail: "" });
  };
  const handleOpenDeleteDialog = (tripmateEmail: string) => {
    setOpenDeleteDialog({ open: true, tripmateEmail });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<{
    email: string;
  }>();
  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    const tripmateEmail = data.email.trim().toLowerCase();
    try {
      setLoading(true);
      const resp = await doInviteTripMate(trip._id, tripmateEmail);
      if (resp == true) {
        addTripmate(tripmateEmail);
        console.log("Invitation sent successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    handleClose();
  };
  return (
    <React.Fragment>
      <Button
        className="justify-start"
        onClick={handleClickOpen}
        startIcon={<GroupAdd className="text-2xl " />}
      >
        <h1 className="text-base font-semibold ">Add tripmate</h1>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className=" pb-0">
          <div className="w-full flex justify-between">
            <h1>{"Add Tripmate"}</h1>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="w-md">
          <TextField
            value={`${window.location.origin}/trips/invite/${trip._id}`}
            fullWidth
            contentEditable={false}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AddLink />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/trips/invite/${trip._id}`
                        );
                        enqueueSnackbar("Trip link copied to clipboard!", {
                          variant: "success",
                        });
                      }}
                    >
                      Copy Link
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Divider className="mt-2">OR</Divider>
          <form onSubmit={handleSubmit(onSubmit)} className=" pt-0">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
                validate: {
                  isNotExample: (value) =>
                    value !== "example@example.com" || "Invalid email address",
                  isNotTripmate: (value) =>
                    !trip.tripmates.includes(value) ||
                    "Email is already a tripmate",
                },
              })}
              placeholder="Enter email address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupAdd />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="contained"
                      color="primary"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CircularProgress size={24} />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Invitation"
                      )}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            {errors.email && (
              <div className="w-full pb-2">
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              </div>
            )}
          </form>
        </DialogContent>
        <Divider textAlign="left">Current trip mates</Divider>
        <List>
          {!!trip.tripmates &&
            trip.tripmates.length > 0 &&
            trip?.tripmates.map((mate, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenDeleteDialog(mate)}
                      color="error"
                    >
                      <Clear className="text-xl" />
                    </IconButton>
                  }
                >
                  <ListItemText>
                    <p className="text-sm text-gray-600">{mate}</p>
                  </ListItemText>
                </ListItem>
                <Dialog
                  open={
                    openDeleteDialog.open &&
                    openDeleteDialog.tripmateEmail === mate
                  }
                  onClose={handleCloseDeleteDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Remove {mate} from trip?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to remove {mate} from this trip?
                      This action cannot be undone.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Disagree</Button>
                    <Button
                      onClick={() => handleDeleteTripmate(mate)}
                      color="error"
                    >
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
            ))}
        </List>
      </Dialog>
    </React.Fragment>
  );
};
const SettingsDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        className="justify-start"
        onClick={handleClickOpen}
        startIcon={<SettingsEthernet className="text-2xl " />}
      >
        <h1 className="text-base font-semibold ">Settings</h1>
      </Button>
      <Dialog
        slotProps={{
          paper: {
            className: "rounded-2xl p-2",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Settings"}</DialogTitle>
        <DialogContent className=" items-center lg:grid-cols-3 grid grid-cols-1 justify-between">
          <div className="lg:col-span-2">
            <h1 className="text-lg font-semibold">Export as CSV</h1>
            <p className=" text-gray-600">Download your trip as a CSV file.</p>
          </div>
          <div className="lg:col-span-1 flex justify-end">
            <Button
              variant="outlined"
              startIcon={<Description />}
              className="text-neutral-800 border-neutral-300 bg-neutral-300 rounded-xl "
            >
              Export
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const SetBudgetDialog = () => {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ budget: number }>();
  const { totalBudget } = useTripDetailStore();
  const { socket } = useSocket();
  const onSubmit = (data: { budget: number }) => {
    socket?.emit("planItemAdded", {
      section: "budget",
      item: data.budget,
    });

    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        className="text-neutral-800 border-neutral-300 bg-neutral-300 rounded-xl"
        startIcon={<BorderColor />}
        onClick={handleClickOpen}
      >
        Set budget
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="set-budget-dialog-title"
      >
        <DialogTitle id="set-budget-dialog-title" className="font-semibold">
          Set Budget
        </DialogTitle>
        <DialogContent className="w-lg ">
          <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-2">
            <FormControl fullWidth>
              <TextField
                defaultValue={totalBudget}
                variant="outlined"
                type="number"
                label="Budget Amount"
                {...register("budget", {
                  required: "Budget is required",
                  min: {
                    value: 0,
                    message: "Budget must be a positive number",
                  },
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
                error={!!errors?.budget}
                helperText={errors?.budget ? errors.budget.message : ""}
              />
            </FormControl>
            <div className="flex justify-end">
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const ExpenseSection: React.FC = () => {
  const paginationModel = { page: 0, pageSize: 5 };
  const { expenses, totalBudget, currentUsage } = useTripDetailStore();
  const [percent, setPercent] = React.useState<number>(0);
  useEffect(() => {
    if (totalBudget) {
      console.log(totalBudget);
      const percent = totalBudget ? (currentUsage / totalBudget) * 100 : 0;
      setPercent(percent);
    }
  }, [currentUsage, totalBudget]);

  return (
    <section className="pt-10" id="budget">
      <div className="bg-white lg:p-10 lg:px-12">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={4}
        >
          <h1 className="text-3xl font-bold">Budget</h1>
          <EditExpenseDialog />
        </Stack>
        <div className="flex justify-between gap-4 pt-4 bg-neutral-200 rounded-xl p-4">
          <div>
            <Stack
              direction={"row"}
              alignItems={"center"}
              className="*:text-3xl"
              gap={1}
            >
              <span className="font-semibold text-green-500">Total : </span>
              <data>{formatCurrency(Number(totalBudget), "en-US")}</data>
            </Stack>
            <Stack
              direction={"column"}
              className="text-sm text-gray-600"
              gap={1}
            >
              <span className="font-semibold">Current usage : </span>
              <Tooltip
                title={
                  <span className={percent > 100 ? "text-red-400" : ""}>
                    {percent.toFixed(2)}%
                  </span>
                }
              >
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percent > 100 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </Tooltip>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              paddingTop={2}
            >
              <SetBudgetDialog />
              <Button
                variant="outlined"
                className="text-neutral-800 border-neutral-300 bg-neutral-300 rounded-xl"
                startIcon={<ReceiptLong />}
              >
                Group balances
              </Button>
            </Stack>
          </div>
          <Stack
            justifyContent={"space-between"}
            gap={1}
            className="h-full *:py-0 *:text-dark-700"
          >
            <InsightsDialog />
            <AddTripmateDialog />
            <SettingsDialog />
          </Stack>
        </div>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ height: 360, width: "100%", marginTop: 2 }}>
            <DataGridPremium
              aiAssistant
              lazyLoading
              slotProps={{
                row: {
                  className: "border-none",
                },
              }}
              rows={expenses}
              columns={expenseColumns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
                sorting: {
                  sortModel: [{ field: "date", sort: "desc" }],
                },
              }}
              paginationModel={paginationModel}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              density="comfortable"
              sx={{
                overflowY: "scroll",
                border: 0,
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeader:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f0f0f0",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px 8px 0 0",
                },
                "& .MuiCheckbox-root": {
                  color: "#9ca3af",
                },
              }}
            />
          </Box>
        </Box>
      </div>
    </section>
  );
};

export default ExpenseSection;
