import { Add, AirplaneTicket } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid2,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTripDetailStore } from "../../../../services/stores/useTripDetailStore";
import { IRelatedBlogs } from "../../../../utils/interfaces/blog";
import { TripTag } from "./elements";
import BlogTag from "./elements/GuideTag";
const HomeTrips: React.FC<{
  blogs?: IRelatedBlogs[];
}> = ({ blogs }) => {
  const { trips } = useTripDetailStore();

  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[1200px] py-10">
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Paper elevation={0} className=" bg-white p-4 h-90 max-h-100">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Link to={"/profile"}>
                <h1 className="my-0 text-2xl hover:underline">Recent trips</h1>
              </Link>
              <Link to="/trips/create">
                <Button
                  variant="contained"
                  className="rounded-sm bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black"
                  startIcon={<Add />}
                >
                  Plan new trip
                </Button>
              </Link>
            </Stack>
            <Stack className="my-2 mt-4">
              {!!trips && trips?.length < 0 ? (
                trips.slice(0, 2).map((item, index) => (
                  <Stack key={index}>
                    <TripTag trip={item} />
                    {index < trips.length - 1 && (
                      <Divider className="border-[--color-neutral-400] border my-4" />
                    )}
                  </Stack>
                ))
              ) : (
                <Stack
                  className="w-full h-full "
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={1}
                >
                  <IconButton className="w-fit bg-gray-100 p-4">
                    <AirplaneTicket />
                  </IconButton>
                  <h1 className="text-xl text-gray-500">
                    You haven’t planned any trips yet.
                  </h1>
                  <p className="text-base text-gray-400">
                    Start planning your next adventure!
                  </p>
                  <Button
                    variant="outlined"
                    className="w-fit rounded-sm bg-white border-gray-300 mt-4 text-gray-800"
                  >
                    Plan your first trip
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={6}>
          <Paper elevation={0} className=" p-4  h-90 max-h-100 overflow-y-auto">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Link to={"/profile"}>
                <h1 className="my-0 text-2xl hover:underline">
                  Your Travel Blogs
                </h1>
              </Link>
              <div>
                <Button
                  variant="contained"
                  onClick={() => navigate("/blogs/create")}
                  className="rounded-sm bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-black"
                  startIcon={<Add />}
                >
                  Write new blog
                </Button>
              </div>
            </Stack>
            <Grid2 container spacing={2} className="my-2 mt-4 ">
              {blogs && blogs.length > 0 ? (
                blogs.slice(0, 2).map((item, index) => (
                  <Grid2 size={6} key={index}>
                    <BlogTag blog={item} />
                  </Grid2>
                ))
              ) : (
                <Stack
                  className="w-full h-full "
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={1}
                >
                  <IconButton className="w-fit bg-gray-100 p-4">
                    <AirplaneTicket />
                  </IconButton>
                  <h1 className="text-xl text-gray-500">
                    You haven't created any blogs yet.
                  </h1>
                  <p className="text-base text-gray-400">
                    Share your travel experiences!
                  </p>
                  <Button
                    variant="outlined"
                    className="w-fit rounded-sm bg-white border-gray-300 mt-4 text-gray-800"
                  >
                    Write your first blog
                  </Button>
                </Stack>
              )}
            </Grid2>
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HomeTrips;
