import React from "react";
// import Header from "../components/Layout/(anonymous)/Header";
import { VerticalAlignTop } from "@mui/icons-material";
import { Divider, Fab } from "@mui/material";
import { animate } from "motion/react";
import { Footer, HotelAuthHeader } from "../components/Layout";

const HotelLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div>
      <HotelAuthHeader />
      <main className="flex flex-col items-center mx-auto justify-center bg-[#f5f5f5]">
        {children}
      </main>
      <Fab
        size="small"
        color="primary"
        aria-label="add"
        className="fixed bottom-4 right-4"
        onClick={() => smoothScrollTo(0)}
      >
        <VerticalAlignTop />
      </Fab>
      <Divider />
      <Footer />
    </div>
  );
};

export default HotelLayout;
