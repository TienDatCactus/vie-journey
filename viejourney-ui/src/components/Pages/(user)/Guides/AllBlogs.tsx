import { Button, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import GuideCard from "./_elements/GuideCard";
import { IBlog } from "../../../../utils/interfaces/blog";
import { useUserBlog } from "../../../../services/stores/useUserBlog";
const AllBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>();
  const { getBlogList } = useUserBlog();
  useEffect(() => {
    (async () => {
      const data = await getBlogList();
      if (data) {
        setBlogs(data);
      }
    })();
  }, []);
  return (
    <div className="w-full max-w-[1200px] ">
      <h1 className="mb-4 text-2xl font-bold ">Recent blogs</h1>
      <Grid2 container spacing={2}>
        {!!blogs?.length &&
          blogs?.map((guide) => (
            <Grid2 size={3} key={guide._id}>
              <GuideCard {...guide} />
            </Grid2>
          ))}
      </Grid2>
      <div className="flex justify-center mt-6">
        <Button
          variant="outlined"
          color="primary"
          className="rounded-4xl py-2 px-10 border-[#d9d9d9] text-[#495057] font-semibold"
        >
          See more
        </Button>
      </div>
    </div>
  );
};

export default AllBlogs;
