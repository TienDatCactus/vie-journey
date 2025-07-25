import { MoreHoriz, PhoneAndroid, Redo, Save, Undo } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../services/context/socketContext";
import { HideOnScroll } from "../Main/(user)/Header";
const TripHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'error'
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { socket } = useSocket();
  const handleSavePlan = () => {
    socket?.emit("requestSaveStatus", { forceSave: true });
  };
  useEffect(() => {
    socket?.on("savePlanStatus", (data) => {
      console.log("Save status received:", data);
      setSaveStatus(data.status);
      setError(data.error || "");
      if (data.status === "saved") {
        setLastSaved(new Date(data.timestamp).toLocaleTimeString());
      }
    });
  }, [socket]);
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
            <img
              src="/icons/icons8-around-the-globe-50.png"
              className="object-cover w-10 h-10 rounded-full"
            />
            <div>
              <div className="text-dark-700 lg:text-xs mb-2 font-semibold uppercase">
                {saveStatus === "saved" && (
                  <p>
                    {lastSaved
                      ? `All changes saved at ${lastSaved}`
                      : "Changes will be save automatically."}
                  </p>
                )}
                {saveStatus === "error" && (
                  <div className="line-clamp-2 w-80">
                    <p> Failed to save changes: {error || "Unknown error"}</p>
                  </div>
                )}
              </div>
              <ButtonGroup className="*:text-neutral-600 *:border-neutral-300">
                <Button startIcon={<Undo />}>Undo</Button>
                <Button startIcon={<Redo />}>Redo</Button>
              </ButtonGroup>
            </div>
          </Stack>
          <Stack direction={"row"} alignItems="center" gap={1}>
            <Button
              variant="contained"
              startIcon={<Save />}
              loading={saveStatus === "saving"}
              disabled={saveStatus === "saving"}
              className="rounded-full text-sm font-semibold px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white"
              onClick={handleSavePlan}
            >
              {saveStatus === "saving" ? "Saving changes..." : "Save"}
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
