import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
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
import { doLogout } from "../../../../services/api";
import { useAuth } from "../../../../services/contexts/AuthContext";
interface Props {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}
export const headerNav: Array<{ name: string; link: string }> = [
  {
    name: "Home",
    link: "/home",
  },
  {
    name: "Travel guides",
    link: "/guides",
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
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { credential } = useAuth();
  const handleLogout = async () => {
    try {
      setLoading(true);
      await doLogout({ userId: credential?.userId || "" });
      setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
            <TravelExploreIcon />
            <h1 className="text-[20px]">VieJourney</h1>
            <Stack direction={"row"} gap={2} className="h-full mx-4 ">
              {!!headerNav.length &&
                headerNav?.map((nav, index) => (
                  <div
                    key={index}
                    className="h-full transition-all duration-200 ease-in-out hover:scale-125"
                  >
                    <a
                      className="no-underline text-[12px] text-[#5b5b5b] font-medium"
                      href={nav.link}
                    >
                      {nav.name}
                    </a>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-[20px]" />
                  </InputAdornment>
                ),
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
              >
                N
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
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
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} disabled={loading}>
                {loading && (
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
