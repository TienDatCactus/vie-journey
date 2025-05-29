import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";

const BlogAppBar = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show AppBar when scrolling past the user avatar section (approximately 400px)
      if (currentScrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AppBar
      position="fixed"
      sx={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        width: "calc(75% - 8px)", // Full width of the SideHeader grid (size 9 out of 12)
        maxWidth: "750px", // Match the container max width
        left: 0, // Align with the SideHeader container
        right: "auto",
        zIndex: 1000,
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
        <div className="flex items-center gap-2">
          <TravelExploreIcon className="text-blue-600 text-2xl" />
          <Typography variant="h6" className="text-blue-600">
            VieJourney
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteBorderIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
          <ChatBubbleOutlineIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
          <ShareIcon className="cursor-pointer hover:scale-110 transition-all duration-300 text-gray-600" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default BlogAppBar;
