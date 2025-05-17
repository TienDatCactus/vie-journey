import { Avatar, Button, ButtonGroup, Stack } from "@mui/material";
import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
const Sider: React.FC = () => {
  return (
    <Stack
      direction={"column"}
      justifyContent={"space-around"}
      className="min-h-[400px] border p-2 py-6 shadow-md rounded-md"
    >
      <Stack direction={"column"} className="text-center">
        <div className="w-full p-4">
          <Avatar className="w-full h-[200px]">H</Avatar>
        </div>
        <h1 className="my-0 text-[18px]">Tien Dat</h1>
        <p className="text-xs my-0 text-neutral-500">@tien65</p>
      </Stack>
      <Stack
        direction={"row"}
        gap={2}
        justifyContent={"center"}
        className="my-4"
      >
        <div className="*:my-0 text-center *:text-neutral-700 *:text-sm">
          <p>0</p>
          <p>Followers</p>
        </div>
        <div className=" text-center *:my-0 *:text-neutral-700 *:text-sm">
          <p>0</p>
          <p>Following</p>
        </div>
      </Stack>
      <ButtonGroup className="flex justify-center">
        <Button startIcon={<EditOutlinedIcon className="text-[16px]" />}>
          Edit
        </Button>
        <Button
          startIcon={<ShareOutlinedIcon className="text-[16px]" />}
          variant="contained"
        >
          Share
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default Sider;
