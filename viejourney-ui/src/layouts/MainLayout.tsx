import { VerticalAlignTop } from "@mui/icons-material";
import { Divider, Fab } from "@mui/material";
import { animate } from "motion/react";
import React from "react";
import { MainAuthHeader, MainUnAuthHeader } from "../components/Layout";
import Footer from "../components/Layout/Main/Footer";
import { useAuthStore } from "../services/stores/useAuthStore";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  const smoothScrollTo = (targetY: number) => {
    const currentY = window.scrollY;
    animate(currentY, targetY, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate(latest) {
        window.scrollTo(0, latest);
      },
    });
  };

  return (
    <>
      {user ? <MainAuthHeader /> : <MainUnAuthHeader />}
      <main className="flex flex-col items-center justify-center bg-neutral-50">
        {children}
      </main>
      <Fab
        size="large"
        aria-label="scroll to top"
        className="fixed bottom-20 right-5 bg-neutral-50"
        onClick={() => smoothScrollTo(0)}
      >
        <VerticalAlignTop />
      </Fab>
      <Divider className="w-full bg-neutral-800" />
      <Footer />
    </>
  );
};

export default MainLayout;
