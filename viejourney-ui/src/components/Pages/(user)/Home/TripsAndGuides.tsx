import { Add } from "@mui/icons-material";
import { Button, Divider, Grid2, Paper, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GuideTag, TripTag } from "./elements";
import { Link, useNavigate } from "react-router-dom";
import useBlogUser from "../../../../utils/hooks/user-blog-user";
import { IBlog } from "../../../../utils/interfaces/blog";
import { ITrip } from "../../../../utils/interfaces/trip";
import { getTripList } from "../../../../services/api/trip";
const HomeTrips: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>();
  const [trips, setTrips] = useState<ITrip[]>();

  const { getBlogList } = useBlogUser();

  const navigate = useNavigate();
  const fetchBlog = async () => {
    const res = await getBlogList();
    if (res) setBlogs(res);
  };

  const fetchTrip = async () => {
    const res = await getTripList();
    if (res) setTrips(res);
  };
  useEffect(() => {
    fetchBlog();
    fetchTrip();
  }, []);
  return (
    <div className="w-full max-w-[1200px] pb-10">
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Paper className="flex flex-col justify-between bg-white p-4 h-[21.25rem] max-h-[25rem]">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <h1 className="my-0 text-[1.5rem] font-bold">Your trips</h1>
              <Link to="/trips/create">
                <Button
                  variant="outlined"
                  className="rounded-sm"
                  startIcon={<Add />}
                >
                  Plan new trip
                </Button>
              </Link>
            </Stack>
            <Stack className="my-2 mt-4">
              {trips && trips.length > 0 ? (
                trips.slice(0, 2).map((item, index) => (
                  <Stack key={index}>
                    <TripTag
                      img={""}
                      title={item?.title}
                      from={item?.startDate}
                      to={item?.startDate}
                    />
                    {index < trips.length - 1 && (
                      <Divider className="border-[--color-neutral-400] border my-4" />
                    )}
                  </Stack>
                ))
              ) : (
                <Paper
                  elevation={0}
                  className="bg-[--color-neutral-100] text-gray-600 text-sm italic py-4 px-2 text-center"
                >
                  You haven’t planned any trips yet. Start by creating one!
                </Paper>
              )}
            </Stack>

            <div className="flex justify-end">
              <Button variant="text" className="p-0 hover:underline">
                See all
              </Button>
            </div>
          </Paper>
        </Grid2>
        <Grid2 size={6}>
          <Paper className="bg-[--color-neutral-200] p-4  h-[21.25rem] max-h-[400px] overflow">
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <h1 className="my-0 text-[1.5rem] font-bold">Your guides</h1>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/blogs/create")}
                  className="rounded-sm"
                  startIcon={<Add />}
                >
                  Create new guide
                </Button>
              </div>
            </Stack>
            <Grid2 container spacing={2} className="my-2 mt-4">
              {blogs && blogs.length > 0 ? (
                blogs.slice(0, 2).map((item, index) => (
                  <Grid2 size={6} key={index}>
                    <GuideTag
                      img={item?.coverImage}
                      title={item?.title}
                      likes={item?.metrics.likeCount}
                      views={item?.metrics.viewCount}
                    />
                  </Grid2>
                ))
              ) : (
                <Grid2 size={12}>
                  <Paper
                    elevation={0}
                    className="bg-[--color-neutral-100] text-gray-600 text-sm italic py-4 px-2 text-center"
                  >
                    You haven’t created any guides yet. Share your travel
                    experiences!
                  </Paper>
                </Grid2>
              )}
            </Grid2>

            <div className="flex justify-end">
              <Button
                onClick={() => navigate("/blogs")}
                variant="text"
                className="p-0 hover:underline"
              >
                See all
              </Button>
            </div>
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default HomeTrips;
