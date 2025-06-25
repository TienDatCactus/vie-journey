import {
  BorderColor,
  Delete,
  Description,
  DirectionsCar,
  Edit,
  Flight,
  GroupAdd,
  Hotel,
  Insights,
  MoreHoriz,
  PriceCheck,
  ReceiptLong,
  Restaurant,
  SettingsEthernet,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import React from "react";
const expenseColumns: GridColDef[] = [
  {
    field: "type",
    headerName: "Type",
    width: 80,
    renderCell: (params) => {
      const iconMap = {
        flight: <Flight className="text-blue-500" />,
        hotel: <Hotel className="text-indigo-500" />,
        restaurant: <Restaurant className="text-amber-500" />,
        car: <DirectionsCar className="text-green-500" />,
        shopping: <ShoppingCart className="text-purple-500" />,
        other: <MoreHoriz className="text-gray-500" />,
      };

      return (
        <div className="flex items-center justify-start h-full">
          {iconMap[params.value as keyof typeof iconMap] || iconMap.other}
        </div>
      );
    },
  },
  {
    field: "title",
    headerName: "Expense",
    flex: 1,
    minWidth: 250,
    renderCell: (params) => (
      <div className="flex flex-col">
        <div className="font-semibold">{params.value}</div>
        {params.row.code && (
          <div className="text-xs text-gray-500 font-mono">
            {params.row.code}
          </div>
        )}
      </div>
    ),
  },
  {
    field: "date",
    headerName: "Date",
    width: 100,
    renderCell: (params) => (
      <div className="flex items-center">
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <div className="font-medium text-right">
        {new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value)}
        <span className="ml-1 text-green-600">{params.row.currency}</span>
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "",
    width: 100,
    sortable: false,
    renderCell: () => (
      <div className="flex h-full items-center justify-center gap-2">
        <IconButton size="small">
          <Edit fontSize="small" className="text-gray-500" />
        </IconButton>
        <IconButton size="small">
          <Delete fontSize="small" className="text-gray-500" />
        </IconButton>
      </div>
    ),
  },
];

const expenseRows = [
  {
    id: 1,
    type: "flight",
    code: "21 Air 12312",
    title: "Round-trip flights to Da Nang",
    date: "24 Jun",
    amount: 123123.0,
    currency: "US$",
  },
  {
    id: 2,
    type: "hotel",
    code: "Booking #A129312",
    title: "Intercontinental Da Nang (3 nights)",
    date: "25 Jun",
    amount: 4500.0,
    currency: "US$",
  },
  {
    id: 3,
    type: "restaurant",
    code: "",
    title: "Dinner at Seafood Restaurant",
    date: "26 Jun",
    amount: 345.5,
    currency: "US$",
  },
  {
    id: 4,
    type: "car",
    code: "Hertz #92123",
    title: "Car rental (4 days)",
    date: "25 Jun",
    amount: 1200.0,
    currency: "US$",
  },
  {
    id: 5,
    type: "shopping",
    code: "",
    title: "Souvenirs and local crafts",
    date: "27 Jun",
    amount: 678.9,
    currency: "US$",
  },
];

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
            <p className=" text-gray-600">
              Download your trip expenses as a CSV file.
            </p>
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
const Expense: React.FC = () => {
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <section className="pt-10">
      <div className="bg-white lg:p-10 lg:px-12">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={4}
        >
          <h1 className="text-3xl font-bold">Budgeting</h1>
          <Button
            className="bg-dark-800"
            variant="contained"
            startIcon={<PriceCheck />}
          >
            Add expense
          </Button>
        </Stack>
        <div className="flex justify-between gap-4 pt-4 bg-neutral-200 rounded-xl p-4">
          <div>
            <Stack
              direction={"row"}
              alignItems={"center"}
              className="*:text-3xl"
              gap={1}
            >
              <data>123.123,00</data>
              <span className="font-semibold text-green-500">US$</span>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              paddingTop={2}
            >
              <Button
                className="text-neutral-800 border-neutral-300 bg-neutral-300 rounded-xl"
                variant="outlined"
                startIcon={<BorderColor />}
              >
                Set budget
              </Button>
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
        <DataGridPremium
          rows={expenseRows}
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
          sx={{
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
      </div>
    </section>
  );
};

export default Expense;
