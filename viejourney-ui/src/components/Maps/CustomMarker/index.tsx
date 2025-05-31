import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { Box, Paper, Grow, ClickAwayListener, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion"; // You'll need to install this

export interface CustomMarkerProps {
  id: string | number;
  position: google.maps.LatLngLiteral;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode; // This will be rendered in the info window
  color?: string;
  size?: number;
  zIndex?: number;
  showInfoOnHover?: boolean;
  onInfoOpen?: () => void;
  onInfoClose?: () => void;
  infoOffset?: { x: number; y: number };
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  id,
  position,
  onClick,
  icon,
  children,
  color = "#3182CE",
  size = 36,
  zIndex = 1,
  showInfoOnHover = false,
  onInfoOpen,
  onInfoClose,
  infoOffset = { x: 0, y: -10 },
}) => {
  const mapInstance = useMap();
  const theme = useTheme();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Custom portal container for the info window
  const [infoContainer, setInfoContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a container for our info window portals if it doesn't exist
    const existingContainer = document.getElementById(
      "custom-map-info-windows"
    );
    if (existingContainer) {
      setInfoContainer(existingContainer);
    } else {
      const newContainer = document.createElement("div");
      newContainer.id = "custom-map-info-windows";
      newContainer.style.position = "absolute";
      newContainer.style.top = "0";
      newContainer.style.left = "0";
      newContainer.style.pointerEvents = "none";
      newContainer.style.width = "100%";
      newContainer.style.height = "100%";
      newContainer.style.zIndex = "10";
      document.body.appendChild(newContainer);
      setInfoContainer(newContainer);
    }

    // Cleanup function
    return () => {
      // Only remove the container if we're the last one using it
      const container = document.getElementById("custom-map-info-windows");
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(() => {
    if (children) {
      setIsInfoOpen((prev) => !prev);
      if (!isInfoOpen && onInfoOpen) onInfoOpen();
      if (isInfoOpen && onInfoClose) onInfoClose();
    }

    if (onClick) onClick();
  }, [children, isInfoOpen, onClick, onInfoOpen, onInfoClose]);

  // Handle mouse enter for hover functionality
  const handleMouseEnter = useCallback(() => {
    if (showInfoOnHover && children) {
      setIsInfoOpen(true);
      if (onInfoOpen) onInfoOpen();
    }
  }, [showInfoOnHover, children, onInfoOpen]);

  // Handle mouse leave for hover functionality
  const handleMouseLeave = useCallback(() => {
    if (showInfoOnHover && children) {
      setIsInfoOpen(false);
      if (onInfoClose) onInfoClose();
    }
  }, [showInfoOnHover, children, onInfoClose]);

  // Handle click away to close info window
  const handleClickAway = () => {
    setIsInfoOpen(false);
    if (onInfoClose) onInfoClose();
  };

  // Calculate pixel position for info window
  const getInfoWindowPosition = () => {
    if (!mapInstance || !markerRef.current) return { top: 0, left: 0 };

    const markerPosition = markerRef.current.getBoundingClientRect();
    return {
      top: markerPosition.top + infoOffset.y,
      left: markerPosition.left + size / 2 + infoOffset.x,
    };
  };

  // Render the info window using a Portal
  const renderInfoWindow = () => {
    if (!isInfoOpen || !children || !infoContainer) return null;

    const position = getInfoWindowPosition();

    return createPortal(
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box
          ref={infoRef}
          sx={{
            position: "absolute",
            top: position.top,
            left: position.left,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* The actual info window content */}
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  minWidth: 250,
                  maxWidth: 350,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    marginLeft: "-10px",
                    borderWidth: "10px 10px 0",
                    borderStyle: "solid",
                    borderColor: `${theme.palette.background.paper} transparent transparent`,
                  },
                }}
              >
                {children}
              </Paper>
            </motion.div>
          </AnimatePresence>
        </Box>
      </ClickAwayListener>,
      infoContainer
    );
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        onClick={handleMarkerClick}
        zIndex={zIndex}
      >
        <Box
          ref={markerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isInfoOpen ? color : "#ffffff",
            color: isInfoOpen ? "#ffffff" : color,
            border: `2px solid ${color}`,
            borderRadius: "50%",
            width: size,
            height: size,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transition: "all 0.2s ease",
            transform: isInfoOpen ? "scale(1.1)" : "scale(1)",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: isInfoOpen ? color : `${color}20`,
            },
          }}
        >
          {icon}
        </Box>
      </AdvancedMarker>

      {/* Render info window via portal */}
      {renderInfoWindow()}
    </>
  );
};

export default CustomMarker;
