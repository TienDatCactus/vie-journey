import { Grid2, Card, Skeleton, CardContent, Box } from "@mui/material";
import React from "react";
const CardSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
  return (
    <Grid2 container spacing={2} className="mt-4 w-full">
      {[...Array(count)].map((_, index) => (
        <Grid2
          size={{
            xs: 12,
            sm: 6,
            lg: 4,
          }}
          key={index}
        >
          <Card className="h-full">
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton
                variant="text"
                height={20}
                width="60%"
                className="mt-2"
              />
              <Skeleton
                variant="text"
                height={16}
                width="100%"
                className="mt-2"
              />
              <Skeleton variant="text" height={16} width="90%" />
              <Box className="flex justify-between items-center mt-4">
                <Skeleton variant="rectangular" width={80} height={24} />
                <Skeleton variant="text" width={100} />
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default CardSkeleton;
