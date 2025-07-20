import {
  AccountCircle,
  HomeWork,
  KeyboardCommandKey,
  Logout,
} from "@mui/icons-material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Slide,
  Stack,
  TextField,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
interface Props {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}
const headerNav: Array<{ name: string; link: string }> = [
  {
    name: "Home",
    link: "/home",
  },
  {
    name: "Travel blogs",
    link: "/blogs",
  },
  {
    name: "Hotels",
    link: "/hotels",
  },

  {
    name: "Profile",
    link: "/profile",
  },
];
export function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

const Header = () => {
  const { user } = useAuthStore();
  const info = useAuthStore((state) => state.info);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { handleLogout, isLoading } = useAuthStore();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = async () => {
    await handleLogout();
    navigate("/");
  };

  const handleDashboardNavigate = () => {
    switch (user?.role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "MANAGER":
        navigate("/manager/dashboard");
        break;
      default:
        navigate("/profile");
    }
  };
  return (
    <HideOnScroll>
      <AppBar position="sticky" color="default" elevation={4}>
        <Toolbar className="min-h-[50px] px-10 flex justify-between items-center bg-white">
          <Stack
            className="h-full"
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Link
              to={"/"}
              className="flex items-center gap-2 hover:scale-110 transition-all duration-200 ease-in-out"
            >
              <img
                src="/icons/icons8-around-the-globe-50.png"
                alt="Logo"
                className="h-8"
              />
              <h1 className="text-[20px]">VieJourney</h1>
            </Link>
            <Stack direction={"row"} gap={2} className="h-full mx-4 ">
              {!!headerNav.length &&
                headerNav?.map((nav, index) => (
                  <div
                    key={index}
                    className="h-full transition-all duration-200 ease-in-out hover:scale-125"
                  >
                    <Link
                      className="no-underline text-[12px] text-[#5b5b5b] font-medium"
                      to={nav.link}
                    >
                      {nav.name}
                    </Link>
                  </div>
                ))}
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2} alignItems={"center"}>
            <TextField
              size="small"
              className="*:text-[12px] bg-[#f3f4f5] border-0 rounded-md"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none", // Removes the border
                  },
                },
              }}
              variant="outlined"
              placeholder="Enter place or user"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-[#727272]" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <NotificationsActiveOutlinedIcon className="cursor-pointer hover:text-[#727272]" />
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ bgcolor: "#1d41c15d", width: 30, height: 30 }}
                className="transition-all duration-200 ease-in-out shadow-md cursor-pointer hover:scale-110"
                src={info?.avatar}
              >
                {info?.fullName?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 26,
                      height: 26,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {user?.role && user?.role !== "USER" && (
                <MenuItem onClick={handleDashboardNavigate}>
                  <KeyboardCommandKey className="mr-2 text-neutral-500" />
                  Dashboard
                </MenuItem>
              )}
              <MenuItem onClick={() => navigate("/profile")}>
                <AccountCircle className="mr-2 text-neutral-500" /> Profile
              </MenuItem>

              <MenuItem onClick={() => navigate("/home")}>
                <Link to={"/home"} style={{ display: "flex" }}>
                  <HomeWork className="mr-2 text-neutral-500" />
                  Main
                </Link>
              </MenuItem>
              <Divider />

              <MenuItem onClick={onLogout} disabled={isLoading}>
                {isLoading && (
                  <CircularProgress size={20} className="animate-spin" />
                )}
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
