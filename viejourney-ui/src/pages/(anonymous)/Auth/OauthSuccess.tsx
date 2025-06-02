import {
  ContactPhoneOutlined,
  DoneAll,
  EmailOutlined,
  HomeWorkOutlined,
  PermIdentity,
  TaskAlt,
} from "@mui/icons-material";
import { Button, ButtonGroup, Chip } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doValidateAccessToken } from "../../../services/api";
import { setToken } from "../../../services/api/token";
import { useAuth } from "../../../services/stores";
const OauthSuccess: React.FC = () => {
  const params = useSearchParams();
  const { setCredential } = useAuth();
  const [oAuth] = useState<{
    accessToken: string | null;
  }>({
    accessToken: params[0].get("accessToken"),
  });
  useEffect(() => {
    if (oAuth?.accessToken) {
      (async () => {
        const resp = await doValidateAccessToken(oAuth?.accessToken || "");
        if (resp !== null) {
          setToken({
            accessToken: oAuth?.accessToken || "",
            userId: resp?.userId || "",
          });
          setCredential({ userId: resp?.userId || "" });
        }
      })();
    } else {
      console.error("No access token found in URL parameters.");
    }
  }, [oAuth?.accessToken]);
  return (
    <div className="relative flex flex-col items-center justify-center w-full bg-[#f8fafc] h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] "></div>
      <div className="rounded-md p-4 w-100 shadow-md bg-white z-10">
        <div className="rounded-full shadow-md bg-green-200 w-fit mx-auto p-4 my-4 ">
          <DoneAll className="text-4xl text-green-700" />
        </div>
        <div className="my-4 text-center">
          <h1 className="text-3xl font-semibold">Authentication Successful!</h1>
          <p className="text-neutral-700">Welcome back!</p>
        </div>
        <div className="my-4 bg-neutral-100 shadow-sm rounded-md grid grid-cols-12 gap-4 items-center p-2 ">
          <img
            className="col-span-3 w-full p-1"
            src="/images/placeholders/icons8-avatar-50.png"
          />
          <div className="col-span-9 flex flex-col justify-center gap-1">
            <h1 className="text-lg">Nguyen tien dat</h1>
            <p className="text-sm text-neutral-700">dat1110@fpt.edu.vn</p>
            <Button
              variant="outlined"
              className="gap-2 rounded-full px-4 w-fit"
              size="small"
            >
              <img src="/icons/icons8-google.svg" className="w-5 h-5" />
              Google
            </Button>
          </div>
        </div>
        <dl className="mt-6">
          <div className="flex items-center justify-between border-b pb-4 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <PermIdentity className="mb-1" />
              <span className="mx-2">Account Status</span>
            </dt>
            <dd className="text-sm font-semibold">
              <Chip label="Verified" className="bg-green-100 text-green-800" />
            </dd>
          </div>
          <div className="flex items-center justify-between border-b pb-4 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <EmailOutlined className="mb-1" />
              <span className="mx-2">Email Verified</span>
            </dt>
            <dd className="text-sm font-semibold"></dd>
            <TaskAlt className="text-green-600" />
          </div>
          <div className="flex items-center justify-between border-b pb-4 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <CalendarIcon className="mb-1" />
              <span className="mx-2">Member Since</span>
            </dt>
            <dd className="text-sm font-semibold">December 2024</dd>
          </div>
        </dl>
        <div>
          <Button variant="contained" className="w-full " href="/">
            Go to Dashboard
          </Button>
          <ButtonGroup className="w-full mt-2">
            <Button
              startIcon={<ContactPhoneOutlined />}
              variant="outlined"
              className="w-full"
            >
              Profile
            </Button>
            <Button
              startIcon={<HomeWorkOutlined />}
              variant="outlined"
              className="w-full"
            >
              Home
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default OauthSuccess;
