import {
  MoreHoriz,
  PhoneAndroid,
  Redo,
  Share,
  TravelExplore,
  Undo,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import React from "react";
import { HideOnScroll } from "../Main/(user)/Header";
const TripHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <HideOnScroll>
      <AppBar
        position="relative"
        color="default"
        elevation={4}
        className=" shadow-sm border-b border-neutral-300  px-4 py-2 bg-neutral-50 text-white w-full"
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <div>
              <TravelExplore className="text-dark-700 lg:text-4xl mb-2 font-semibold uppercase" />
            </div>
            <div>
              <p className="text-dark-700 lg:text-xs mb-2 font-semibold uppercase">
                Saved
              </p>
              <ButtonGroup className="*:text-neutral-600 *:border-neutral-300">
                <Button startIcon={<Undo />}>Undo</Button>
                <Button startIcon={<Redo />}>Redo</Button>
              </ButtonGroup>
            </div>
          </Stack>
          <Stack direction={"row"} alignItems="center" gap={1}>
            <Button
              variant="contained"
              startIcon={<Share />}
              className="rounded-full text-sm font-semibold px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white"
            >
              Share
            </Button>
            <Tooltip title="Coming soon!">
              <Button
                startIcon={<PhoneAndroid />}
                variant="contained"
                className="rounded-full text-sm font-semibold px-4 py-2 bg-dark-500  text-white"
              >
                Get app
              </Button>
            </Tooltip>
            <IconButton
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </AppBar>
    </HideOnScroll>
  );
};

export default TripHeader;
