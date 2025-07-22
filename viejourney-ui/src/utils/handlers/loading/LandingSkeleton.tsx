import { Box, Card, Grid2, Skeleton, Stack } from "@mui/material";
const HomePageSkeleton = {
  // Hero Section Skeleton
  Hero: () => (
    <Box className="relative w-full h-140 overflow-hidden flex items-end justify-center">
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{ position: "absolute", top: 0, left: 0 }}
      />
      <Stack
        spacing={3}
        justifyContent={"space-between"}
        alignItems={"end"}
        direction={"row"}
        className="w-full p-10"
      >
        <div className="flex-1">
          <div>
            <Skeleton
              variant="text"
              width="60%"
              sx={{ fontSize: "3rem" }}
              height={120}
            />
          </div>
          <Skeleton
            variant="text"
            width="60%"
            height={40}
            sx={{ fontSize: "1.5rem" }}
          />
        </div>
        <Stack direction="row" spacing={2} className="mt-4">
          <Skeleton
            variant="rectangular"
            width={140}
            height={48}
            sx={{ borderRadius: 2 }}
          />
        </Stack>
      </Stack>
    </Box>
  ),

  // Advert Section Skeleton
  Advert: () => (
    <Box className="py-8">
      <div className="grid grid-cols-12 gap-4 p-4 ">
        <div className="col-span-3 flex items-start justify-start">
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            sx={{ borderRadius: 1, mb: 2 }}
          />
        </div>
        <div className="text-start col-span-6">
          <Skeleton variant="text" height={68} />
          <Skeleton variant="text" height={68} />
          <Skeleton variant="text" width="80%" height={24} className="mb-2" />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
        <div className="col-span-3 flex justify-end items-end">
          <Skeleton
            variant="rectangular"
            width={120}
            height={48}
            sx={{ borderRadius: 1 }}
          />
        </div>
      </div>

      <Grid2 container spacing={3}>
        {[1, 2].map((item) => (
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
            key={item}
          >
            <Card elevation={0} className="p-4 shadow-sm">
              <Stack spacing={2} direction={"row"} alignItems="start">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{ borderRadius: 1, mb: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  width="30%"
                  height={60}
                  sx={{ borderRadius: 1, mb: 2 }}
                />
              </Stack>
              <Skeleton
                variant="text"
                width="80%"
                height={50}
                className="my-2"
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                className="mb-1"
              />
              <Skeleton variant="text" width="90%" height={20} />
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  ),

  // Guides Section Skeleton
  Guides: () => (
    <Box className="py-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-center items-start gap-4 py-10">
          <Skeleton
            variant="rounded"
            width="20%"
            height={28}
            sx={{ fontSize: "2rem" }}
          />
          <Skeleton variant="text" width="100%" height={200} />
        </div>
        <div className="lg:col-span-6 col-span-12 flex flex-col justify-evenly items-start ">
          <div className="w-full">
            <Skeleton variant="text" width="100%" height={30} />
            <Skeleton variant="text" width="100%" height={30} className="" />
          </div>
          <Skeleton
            variant="rectangular"
            width="30%"
            height={40}
            className="rounded-md"
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {[1, 2, 3].map((_, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 min-h-80 relative border-neutral-300  "
          >
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Skeleton variant="text" width="60%" height={24} />
          </li>
        ))}
      </ul>
    </Box>
  ),

  // Banner Section Skeleton
  Banner: () => (
    <div className=" max-w-[75rem] pb-10  relative ">
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        <div>
          <Skeleton variant="rounded" width="20%" height={40} />
        </div>
        <div>
          <Skeleton variant="text" height={200} />
          <Skeleton variant="text" height={24} width="90%" />
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="text" height={24} width="70%" />
        </div>
      </div>
      <div className="flex w-full flex-col-reverse py-10">
        <ul className="flex w-full gap-4">
          {[1, 2, 3].map((_, index) => (
            <li key={index} className="flex-1 mb-4">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 1 }}
              />
              <div className="flex flex-col gap-2 items-center mt-4">
                <Skeleton variant="text" width="60%" height={34} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  // Testimonial Section Skeleton
  Testimonial: () => (
    <div className="max-w-[75rem] flex flex-col items-center lg:py-10 lg:pb-20 ">
      <Skeleton variant="rounded" width="10%" height={34} />
      <Skeleton variant="text" width="80%" height={52} />
      <Skeleton variant="text" width="70%" height={42} />
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="50%" height={22} />
      <ul className="flex justify-center items-center gap-8 mt-10">
        <li>
          <Skeleton variant="rectangular" width={160} height={160} />
        </li>
        <li className="scale-110 transition-all duration-200 hover:scale-125 flex flex-col items-center">
          <Skeleton variant="rectangular" width={160} height={160} />
          <Skeleton variant="text" width="60%" height={22} />
          <Skeleton variant="text" width="70%" height={12} />
        </li>
        <li>
          <Skeleton variant="rectangular" width={160} height={160} />
        </li>
      </ul>
    </div>
  ),
};

export default HomePageSkeleton;
