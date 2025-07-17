import {
  ExitToApp,
  KeyboardDoubleArrowUp,
  KeyboardReturn,
  SettingsInputSvideo,
  ZoomOutMap,
} from "@mui/icons-material";
import {
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainAuthHeader, MainUnAuthHeader } from "../components/Layout";
import Footer from "../components/Layout/Main/Footer";
import { useAuthStore } from "../services/stores/useAuthStore";
import { smoothScrollTo } from "../utils/handlers/utils";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadCurrentUser, loadUserInfo, credential, info } =
    useAuthStore();

  useEffect(() => {
    const run = async () => {
      if (!credential?.token || user) return;
      if (!info) {
        await loadUserInfo();
      }
      await loadCurrentUser();
    };
    run();
  }, [credential?.token, user, loadCurrentUser, loadUserInfo]);
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
    {
      icon: <KeyboardReturn />,
      name: "Return",
      onClick: () => {
        navigate(-1);
      },
    },
  ];

  return (
    <>
      {user ? <MainAuthHeader /> : <MainUnAuthHeader />}
      <main className="flex flex-col items-center justify-center ">
        {children}
      </main>

      <SpeedDial
        sx={{
          position: "fixed",
          bottom: 100,
          right: 15,
          zIndex: 1000,
        }}
        ariaLabel="SpeedDial"
        icon={<SpeedDialIcon openIcon={<SettingsInputSvideo />} />}
        FabProps={{ className: "bg-[#0042da]  text-white" }}
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
      <Divider className="w-full bg-neutral-800" />
      <Footer />
    </>
  );
};

export default MainLayout;
