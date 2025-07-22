import React from "react";
import { useMediaQuery, Box, Typography } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

const ScreenGuard: React.FC<Props> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:1024px)");

  if (isMobile) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
        px={2}
      >
        <img
          src="/images/under_contruct.gif"
          className="object-cover w-full h-auto"
        />
        <Typography variant="body1" className="font-medium text-gray-700">
          This feature is not available on mobile devices. Please visit us on a
          desktop browser.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ScreenGuard;
