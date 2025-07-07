import {
  AttachMoney,
  BorderColor,
  CameraAlt,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSocket } from "../../../../../../services/context/socketContext";
import { Expense } from "../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import { formatCurrency } from "../../../../../../utils/handlers/utils";

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
        startIcon={<Insights className="text-2xl " />}
      >
        <h1 className="text-base font-semibold ">Insights</h1>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
const AddTripmateDialog = () => {
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
        <DialogTitle id="alert-dialog-title">{"Add Tripmate"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Here you can add a tripmate to your trip.
          </DialogContentText>
          {/* Add form or content for adding tripmate here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            Add
          </Button>
        </DialogActions>
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
          <h1 className="text-3xl font-bold">Budgeting</h1>
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
