import { Skeleton, Box, Grid, Card, Stack, Container } from "@mui/material";
import React from "react";

const HomePageSkeleton = {
  // Hero Section Skeleton
  Hero: () => (
    <Box className="relative w-full h-[70vh] overflow-hidden">
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{ position: "absolute", top: 0, left: 0 }}
      />
      <Container className="relative z-10 h-full flex flex-col justify-center items-center text-center">
        <Stack spacing={3} alignItems="center" className="w-full max-w-2xl">
          <Skeleton
            variant="text"
            width="80%"
            height={80}
            sx={{ fontSize: "3rem" }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={40}
            sx={{ fontSize: "1.5rem" }}
          />
          <Stack direction="row" spacing={2} className="mt-4">
            <Skeleton
              variant="rectangular"
              width={140}
              height={48}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width={140}
              height={48}
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  ),

  // Advert Section Skeleton
  Advert: () => (
    <Box className="py-8">
      <Stack spacing={3} alignItems="center" className="mb-8">
        <Skeleton
          variant="text"
          width="40%"
          height={48}
          sx={{ fontSize: "2rem" }}
        />
        <Skeleton variant="text" width="60%" height={24} />
      </Stack>

      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Card className="p-4">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={28}
                className="mb-2"
              />
              <Skeleton
                variant="text"
                width="100%"
                height={20}
                className="mb-1"
              />
              <Skeleton variant="text" width="90%" height={20} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ),

  // Guides Section Skeleton
  Guides: () => (
    <Box className="py-8">
      <Stack spacing={2} alignItems="center" className="mb-8">
        <Skeleton
          variant="text"
          width="50%"
          height={48}
          sx={{ fontSize: "2rem" }}
        />
        <Skeleton variant="text" width="70%" height={24} />
      </Stack>

      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card className="overflow-hidden">
              <Skeleton variant="rectangular" width="100%" height={240} />
              <Box className="p-3">
                <Skeleton
                  variant="text"
                  width="70%"
                  height={24}
                  className="mb-1"
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  className="mb-1"
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  className="mb-2"
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Skeleton variant="text" width={60} height={20} />
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={32}
                    sx={{ borderRadius: 1 }}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ),

  // Banner Section Skeleton
  Banner: () => (
    <Box className="py-8">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Skeleton
              variant="text"
              width="90%"
              height={48}
              sx={{ fontSize: "2rem" }}
            />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />

            <Stack direction="row" spacing={2} className="mt-4">
              <Skeleton
                variant="rectangular"
                width={120}
                height={40}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={120}
                height={40}
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  ),

  // Testimonial Section Skeleton
  Testimonial: () => (
    <Box className="py-8">
      <Stack spacing={2} alignItems="center" className="mb-8">
        <Skeleton
          variant="text"
          width="45%"
          height={48}
          sx={{ fontSize: "2rem" }}
        />
        <Skeleton variant="text" width="55%" height={24} />
      </Stack>

      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Card className="p-4 h-full">
              <Stack direction="row" spacing={2} className="mb-3">
                <Skeleton variant="circular" width={50} height={50} />
                <Box className="flex-1">
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    className="mb-1"
                  />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Stack>

              <Skeleton
                variant="text"
                width="100%"
                height={20}
                className="mb-1"
              />
              <Skeleton
                variant="text"
                width="100%"
                height={20}
                className="mb-1"
              />
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                className="mb-3"
              />

              <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton
                    key={star}
                    variant="circular"
                    width={16}
                    height={16}
                  />
                ))}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ),

  // Call to Action Section Skeleton
  CallToAction: () => (
    <Box className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" className="text-center">
          <Skeleton
            variant="text"
            width="70%"
            height={56}
            sx={{ fontSize: "2.5rem" }}
          />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={24} />

          <Stack direction="row" spacing={2} className="mt-6">
            <Skeleton
              variant="rectangular"
              width={160}
              height={50}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width={160}
              height={50}
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  ),
};

export default HomePageSkeleton;
