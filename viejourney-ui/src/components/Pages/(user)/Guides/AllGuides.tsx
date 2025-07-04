import { Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import GuideCard from "./_elements/GuideCard";
import { IBlog } from "../../../../utils/interfaces/blog";
import useBlogUser from "../../../../utils/hooks/user-blog-user";
const AllGuides: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>();
  const { getBlogList } = useBlogUser();

  const fetchBlog = async () => {
    const res = await getBlogList();
    if (res) setBlogs(res);
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-4 text-[1.25rem] font-bold">Recent guides</h1>
      <Grid2 container spacing={2}>
        {!!(blogs?.length) &&
          blogs?.map((guide) => (
            <Grid2 size={3} key={guide._id}>
              <GuideCard {...guide}  />
            </Grid2>
          ))}
      </Grid2>
      {/* <Stack direction={"row"} justifyContent={"center"}>
        <Button
          variant="outlined"
          color="primary"
          className="rounded-4xl py-2 px-10 border-[#d9d9d9] text-[#495057] font-semibold"
        >
          See more
        </Button>
      </Stack> */}
    </div>
  );
};

export default AllGuides;
