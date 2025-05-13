import { Button, Divider, Grid2, Stack } from "@mui/material";
import EastSharpIcon from "@mui/icons-material/EastSharp";
const HotelAds: React.FC = () => {
  return (
    <div className=" max-w-[1200px] mt-20 w-full py-10 px-10">
      <Stack
        direction={"row"}
        className="w-full mb-20"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 className="font-light text-[3.125rem] w-2/3">
          Enjoy complete and best quality facilities
        </h1>
        <div>
          <Button className="bg-[#181818] px-4 text-[#d9d9d9]">See more</Button>
        </div>
      </Stack>
      <Divider flexItem className="border-[#ccc] my-4 border" />
      <Grid2 container flexDirection={"column"} gap={2}>
        <Grid2>
          <Stack>
            <Grid2 container>
              <Grid2 size={5}>
                <img
                  src={`https://placehold.co/600x400/1a1a1a/ffffff?text=Advertisement`}
                />
              </Grid2>
              <Grid2 size={1}>
                <h1 className="text-center text-[1.25rem] font-medium ">01</h1>
              </Grid2>
              <Grid2 size={6}>
                <Stack
                  direction={"column"}
                  justifyContent={"space-between"}
                  className="h-full"
                >
                  <Stack direction={"column"} gap={2}>
                    <h1 className="text-[2.5rem] ">Indoor Swiming Pool</h1>
                    <p className="text-[1rem] text-[#616161]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page
                    </p>
                  </Stack>
                  <a className="">
                    <EastSharpIcon className="text-[#808080] text-[40px] font-light cursor-pointer hover:translate-x-1/2 transition-transform duration-75" />
                  </a>
                </Stack>
              </Grid2>
            </Grid2>
            <Divider className="border-[#ccc] my-4 border" flexItem />
          </Stack>
        </Grid2>
        <Grid2>
          <Stack>
            <Grid2 container>
              <Grid2 size={5}>
                <img
                  src={`https://placehold.co/600x400/1a1a1a/ffffff?text=Advertisement`}
                />
              </Grid2>
              <Grid2 size={1}>
                <h1 className="text-center text-[1.25rem] font-medium ">02</h1>
              </Grid2>
              <Grid2 size={6}>
                <Stack
                  direction={"column"}
                  justifyContent={"space-between"}
                  className="h-full"
                >
                  <Stack direction={"column"} gap={2}>
                    <h1 className="text-[2.5rem] ">Gym Training Ground</h1>
                    <p className="text-[1rem] text-[#616161]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page
                    </p>
                  </Stack>
                  <a className="">
                    <EastSharpIcon className="text-[#808080] text-[40px] font-light cursor-pointer hover:translate-x-1/2 transition-transform duration-75" />
                  </a>
                </Stack>
              </Grid2>
            </Grid2>
            <Divider className="border-[#ccc] my-4 border" flexItem />
          </Stack>
        </Grid2>
        <Grid2>
          <Stack>
            <Grid2 container>
              <Grid2 size={5}>
                <img
                  src={`https://placehold.co/600x400/1a1a1a/ffffff?text=Advertisement`}
                />
              </Grid2>
              <Grid2 size={1}>
                <h1 className="text-center text-[1.25rem] font-medium ">03</h1>
              </Grid2>
              <Grid2 size={6}>
                <Stack
                  direction={"column"}
                  justifyContent={"space-between"}
                  className="h-full"
                >
                  <Stack direction={"column"} gap={2}>
                    <h1 className="text-[2.5rem] ">Café & Restaurant</h1>
                    <p className="text-[1rem] text-[#616161]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page
                    </p>
                  </Stack>
                  <a className="">
                    <EastSharpIcon className="text-[#808080] text-[40px] font-light cursor-pointer hover:translate-x-1/2 transition-transform duration-75" />
                  </a>
                </Stack>
              </Grid2>
            </Grid2>
            <Divider className="border-[#ccc] my-4 border" flexItem />
          </Stack>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HotelAds;
