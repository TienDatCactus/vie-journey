import { useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";

interface CardProps {
  imageSrc?: string;
  title?: string;
  size?: string;
  index?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasNavigation?: boolean;
}

function Card({ 
  imageSrc = "/images/banner.jpg", 
  title = "Gallery Image", 
  size = "141.1 KB",
  onNavigate,
  hasNavigation = false
}: CardProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (onNavigate) {
      onNavigate(direction);
    }
  };

  return (
    <>
      <div 
        className="w-full h-[340px] bg-white p-[10px] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow"
        onClick={handleOpen}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-[250px] object-cover rounded-[5px]"
        />
        <div>
          <h3 className="font-[700] text-[20px]">{title}</h3>
          <p className="mt-[10px] text-[#a6acaf]">{size}</p>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <Box className="relative max-w-[90vw] max-h-[90vh] outline-none">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[-1]"
            onClick={handleClose}
          />
          
          {/* Close button */}
          <IconButton
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            size="large"
          >
            <Close />
          </IconButton>

          {/* Navigation buttons */}
          {hasNavigation && (
            <>
              <IconButton
                onClick={() => handleNavigate('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                size="large"
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={() => handleNavigate('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                size="large"
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* Image */}
          <img
            src={imageSrc}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-[8px]"
          />
          
          {/* Upload text in top left (similar to your image) */}
          <div className="absolute top-4 left-4 text-white text-sm opacity-70">
            Upload
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Card;