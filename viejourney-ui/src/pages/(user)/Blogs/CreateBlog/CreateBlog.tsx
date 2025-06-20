import { AddLocationAlt, Draw, Public } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Chip,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { Form, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../../layouts";
const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      destination: "",
    },
    mode: "onChange",
  });
  return (
    <MainLayout>
      <div className="max-w-[125rem] flex flex-col items-center justify-center h-screen mx-auto">
        <div className="text-center space-y-4">
          <Chip
            label="Travel Community"
            icon={<Public className="text-blue-700" />}
            className="bg-blue-200 text-blue-700 px-2"
          />
          <h1 className="lg:text-6xl font-bold ">
            Write a{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent h-16 bg-clip-text">
              travel blog
            </span>
          </h1>
          <p className="text-lg text-gray-600 w-2/3 mx-auto">
            Help fellow travelers discover amazing places by sharing your
            experiences, tips, and unforgettable moments from your adventures.
          </p>
        </div>
        <div className="shadow-md rounded-lg p-4 bg-white w-full max-w-xl mt-8">
          <Stack
            direction={"row"}
            spacing={1}
            alignItems="center"
            className="mb-4"
          >
            <AddLocationAlt />
            <h1>Where did you travel?</h1>
          </Stack>
          <Form {...form}>
            <FormControl fullWidth>
              <TextField label="Destination" variant="filled" fullWidth />
            </FormControl>
          </Form>
          <div className="my-4">
            <p className="lg:text-sm text-gray-500">Popular destinations: </p>
            <Stack direction="row" spacing={1} className="mt-2" flexWrap="wrap">
              {["Paris", "New York", "Tokyo", "London", "Sydney"].map(
                (destination, index) => (
                  <Chip key={index} label={destination} />
                )
              )}
            </Stack>
          </div>
          <ButtonGroup fullWidth className="flex justify-end mt-4">
            <Button
              onClick={() => navigate("/blogs/edit/1231")}
              variant="contained"
              startIcon={<Draw />}
              type="submit"
            >
              Create Blog
            </Button>
            <Button
              onClick={() => navigate("/trip/create")}
              startIcon={<AddLocationAlt />}
            >
              Plan a trip instead
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateBlog;
