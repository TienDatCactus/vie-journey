import { Container, Grid, Modal, Box, IconButton } from "@mui/material";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";
import { useState } from "react";

// Dữ liệu mẫu cho gallery
const galleryImages = Array.from({ length: 9 }).map((_, index) => ({
  id: index,
  src: "/images/banner.jpg", // Thay thế bằng đường dẫn ảnh thực tế
  title: "Gallery Image",
  size: "141.1 KB"
}));

// Simple Card component without modal
function SimpleCard({ imageSrc, title, size, onClick }: {
  imageSrc: string;
  title: string;
  size: string;
  onClick: () => void;
}) {
  return (
    <div 
      className="w-full h-[340px] bg-white p-[10px] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow"
      onClick={onClick}
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
  );
}

function Banner() {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpen = (index: number) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const currentImage = galleryImages[currentImageIndex];

  return (
    <AdminLayout>
      <div className="py-[30px] bg-[#f6f8f9] min-h-screen">
        <Container>
          <Grid container spacing={2}>
            {galleryImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <SimpleCard
                  imageSrc={image.src}
                  title={image.title}
                  size={image.size}
                  onClick={() => handleOpen(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Modal */}
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

            {/* Image */}
            <img
              src={currentImage?.src}
              alt={currentImage?.title}
              className="max-w-full max-h-full object-contain rounded-[8px]"
            />
            
         
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Banner;