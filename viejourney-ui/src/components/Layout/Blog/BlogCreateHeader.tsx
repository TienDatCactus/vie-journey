"use client";

import {
  ArrowBack,
  EditLocationAlt,
  EmergencyShare,
  SaveAs,
  Visibility,
} from "@mui/icons-material";
import { AppBar, Button, Divider, Stack, Toolbar } from "@mui/material";
import type React from "react";

const BlogCreateHeader: React.FC<{
  onSaveDraft: () => void;
  onPublic: () => void;
  type: string;
}> = ({ onSaveDraft, onPublic, type }) => {
  const handleSaveDraft = () => {
    onSaveDraft();
   
  };

  const handlePublicBlog = () => {
    onPublic();
  };

  return (
    <AppBar position="static" className="bg-white w-full">
      <Toolbar className="flex justify-between items-center">
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          className="h-full px-4"
        >
          <Button className="text-dark-800" startIcon={<ArrowBack />} href="/">
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
          {type === "draft" ? (
            <>
              <Button
                startIcon={<SaveAs />}
                className="border border-gray-300 text-gray-800 px-4"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                variant="contained"
                startIcon={<EmergencyShare />}
                className="bg-blue-600"
                onClick={handlePublicBlog}
              >
                Publish
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<SaveAs />}
                className="bg-blue-600"
                onClick={handleSaveDraft}
              >
                Save
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default BlogCreateHeader;
