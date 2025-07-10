import {
  AccountBalanceWallet,
  ArrowBack,
  DirectionsTransit,
  LensBlur,
  NoteAltOutlined,
  PlaceOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import * as React from "react";
import { TripHeader } from "../components/Layout";
import { TripMap } from "../components/Pages/(user)/Trips";
import { useTripDetailStore } from "../services/stores/useTripDetailStore";
import { getDatesBetween } from "../utils/handlers/utils";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const TripLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  const [open, setOpen] = React.useState(false);
  const { trip } = useTripDetailStore();
  const [dates, setDates] = React.useState<string[]>([]);
  React.useEffect(() => {
    setDates(getDatesBetween(trip?.startDate || "", trip?.endDate || ""));
  }, [trip.startDate, trip.endDate]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const iconMap: Record<string, React.ReactElement> = {
    Notes: <NoteAltOutlined />,
    Transits: <DirectionsTransit />,
    Places: <PlaceOutlined />,
    Itinerary: <ScheduleOutlined />,
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // Use full viewport height
        overflow: "hidden", // Prevent outer scrolling
      }}
    >
      {/* Left sidebar drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            position: "relative", // Make drawer position relative instead of fixed
            height: "100%",
          },
        }}
      >
        <Stack justifyContent={"space-between"} sx={{ height: "100%" }}>
          <div>
            <Divider />
            {/* Your sidebar menu items */}
            <List>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={handleBack}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: open ? 3 : "auto",
                    }}
                  >
                    <ArrowBack />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Return"}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {["Notes", "Transits", "Places", "Itinerary"].map(
                (text, index) => (
                  <a href={`#${text.toLowerCase()}`} key={index} className="">
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          px: 2.5,
                          justifyContent: open ? "initial" : "center",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            mr: open ? 3 : "auto",
                          }}
                        >
                          {iconMap[text]}
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          sx={{
                            opacity: open ? 1 : 0,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </a>
                )
              )}
            </List>
            <Divider className="border-dashed border-gray-800" />
            <List className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
              {!!dates &&
                dates.length > 0 &&
                dates.map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <a href={`#${index}`}>
                      <ListItemButton
                        className="flex items-center justify-center"
                        sx={{
                          minHeight: 48,
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            mr: open ? 3 : "auto",
                          }}
                        >
                          <LensBlur />
                        </ListItemIcon>
                        <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                          <span className=" text-xs">{text}</span>
                        </ListItemText>
                      </ListItemButton>
                    </a>
                  </ListItem>
                ))}
            </List>
            <Divider className="border-dashed border-gray-800" />
            <List>
              <ListItem disablePadding sx={{ display: "block" }}>
                <a href="#budget">
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: open ? "initial" : "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
                        mr: open ? 3 : "auto",
                      }}
                    >
                      <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Budget"}
                      sx={{
                        opacity: open ? 1 : 0,
                      }}
                    />
                  </ListItemButton>
                </a>
              </ListItem>
            </List>
          </div>
          <Button
            className="bg-neutral-300 lg:h-15 rounded-none text-gray-600"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </Button>
        </Stack>
      </Drawer>

      {/* Content area */}
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4.0px 8.0px 8.0px rgba(0,0,0,0.38)",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        <TripHeader />
        <main className="flex-1 overflow-y-auto bg-neutral-100 h-screen">
          {children}
        </main>
      </Box>

      <Box
        sx={{
          width: "50%",
          height: "100%",
          position: "relative",
        }}
      >
        <TripMap />
      </Box>
    </Box>
  );
};

export default TripLayout;
