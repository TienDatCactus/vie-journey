import {
  Add,
  AddAPhoto,
  AddCard,
  AddLocation,
  Delete,
  MoreTime,
} from "@mui/icons-material";
import { Button, Chip, Divider, Grid2, IconButton, Stack } from "@mui/material";
import React from "react";
const BlogCreateToolbar: React.FC = () => {
  const snippets = [
    {
      title: "Photo",
      icon: <AddAPhoto />,
    },
    {
      title: "Location",
      icon: <AddLocation />,
    },
    {
      title: "Cost",
      icon: <AddCard />,
    },
    {
      title: "Time",
      icon: <MoreTime />,
    },
  ];
  return (
    <aside className="col-span-3 rounded-lg border border-neutral-300 bg-white shadow-md p-4 h-fit space-y-4">
      <div>
        <h1 className="font-semibold">Blog Sections</h1>
        <ul className="space-y-2 py-2">
          <li className="p-2 rounded-sm hover:bg-neutral-200 duration-200 transition-all cursor-pointer flex itemce justify-between">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="text-sm"
            >
              <span className="text-green-500">&#x2022;</span>
              <p>Introduction</p>
            </Stack>
            <IconButton
              size="small"
              className="group hover:bg-red-500 transition-all duration-200"
            >
              <Delete className="size-5 group-hover:text-white" />
            </IconButton>
          </li>
        </ul>
        <Button startIcon={<Add />} className="w-full">
          Add Section
        </Button>
      </div>
      <Divider />
      <div>
        <h1 className="font-semibold">Quick add snippets</h1>
        <Grid2 container className="mt-2" spacing={1}>
          {snippets.map((snippet, index) => (
            <Grid2
              key={index}
              size={{
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
                xl: 6,
              }}
            >
              <Button
                startIcon={snippet.icon}
                className="w-full text-dark-800 border border-gray-300"
              >
                {snippet.title}
              </Button>
            </Grid2>
          ))}
        </Grid2>
      </div>
      <Divider />
      <div>
        <h1 className="font-semibold">Blog info</h1>
        <dl className="py-2 space-y-2">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Status</dt>
            <dd>
              <Chip
                size="small"
                className="bg-green-500 text-white"
                label="Draft"
              />
            </dd>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Created at</dt>
            <dd className="text-sm text-gray-500">12 minutes ago</dd>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <dt>Last saved</dt>
            <dd className="text-sm text-gray-500">9 minutes ago</dd>
          </Stack>
        </dl>
      </div>
    </aside>
  );
};

export default BlogCreateToolbar;
