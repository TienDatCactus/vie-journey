import {
  ArrowBack,
  EditLocationAlt,
  EmergencyShare,
  SaveAs,
  Visibility,
} from "@mui/icons-material";
import { AppBar, Button, Divider, Stack, Toolbar } from "@mui/material";
import React from "react";
const BlogCreateHeader: React.FC = () => {
  return (
    <AppBar position="static" className=" bg-white w-full">
      <Toolbar className="flex justify-between items-center ">
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          className="h-full px-4"
        >
          <Button className="text-dark-800 " startIcon={<ArrowBack />}>
            Back to Home
          </Button>
          <Divider flexItem orientation="vertical" />
          <Stack
            direction="row"
            spacing={1}
            className="text-neutral-600 text-sm"
          >
            <EditLocationAlt />
            <p>paris, france</p>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <data value="words" className="text-sm text-gray-600">
            90 words
          </data>
          <Button startIcon={<Visibility />} className="text-dark-800">
            Preview
          </Button>
          <Button
            startIcon={<SaveAs />}
            className="border border-gray-300 text-gray-800 px-4"
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<EmergencyShare />}
            className="bg-blue-600"
          >
            Publish
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default BlogCreateHeader;
