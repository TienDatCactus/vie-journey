import React from "react";
// import Header from "../components/Layout/(anonymous)/Header";
import {
  ExitToApp,
  KeyboardDoubleArrowUp,
  SettingsInputSvideo,
  ZoomOutMap,
} from "@mui/icons-material";
import { Divider, SpeedDial, SpeedDialAction } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Footer, HotelAuthHeader } from "../components/Layout";
import { smoothScrollTo } from "../utils/handlers/utils";

const HotelLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const actions = [
    {
      icon: <KeyboardDoubleArrowUp />,
      name: "Back to top",
      onClick: () => smoothScrollTo(0),
    },
    {
      icon: <ExitToApp />,
      name: "Back to home",
      onClick: () => {
        navigate("/home");
      },
    },
    {
      icon: <ZoomOutMap />,
      name: "Fullscreen",
      onClick: () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement && elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      },
    },
  ];

  return (
    <div>
      <HotelAuthHeader />
      <main className="flex flex-col items-center mx-auto justify-center bg-neutral-100">
        {children}
      </main>
      <SpeedDial
        sx={{
          position: "fixed",
          bottom: 100,
          right: 15,
          zIndex: 1000,
        }}
        ariaLabel="SpeedDial tooltip example"
        icon={<SettingsInputSvideo />}
        FabProps={{ className: "bg-[#0042da] text-white" }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            onClick={action.onClick}
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: { title: action.name },
            }}
          />
        ))}
      </SpeedDial>
      <Divider />
      <Footer />
    </div>
  );
};

export default HotelLayout;
