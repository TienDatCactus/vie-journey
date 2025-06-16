import {
  CalendarMonth,
  Cancel,
  ContactPhoneOutlined,
  DoneAll,
  EmailOutlined,
  HomeWorkOutlined,
  PermIdentity,
  TaskAlt,
} from "@mui/icons-material";
import { Button, ButtonGroup, Chip, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doValidateAccessToken } from "../../../services/api";
import { useAuthStore } from "../../../services/stores/useAuthStore";
import { setToken } from "../../../services/api/token";
const OauthSuccess: React.FC = () => {
  const { loadUserFromToken, setCredential, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = React.useState<number>(5);
  const params = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const handleCallback = async () => {
      const token = params[0].get("accessToken");
      if (token) {
        try {
          setLoading(true);
          const tokenData = await doValidateAccessToken(token);
          if (tokenData?.userId) {
            setLoading(false);
            enqueueSnackbar("Authentication successful!", {
              variant: "success",
            });
            setToken({
              accessToken: token,
              userId: tokenData.userId,
            });
            setCredential({ userId: tokenData.userId, token });
            await loadUserFromToken();
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
        }
      } else {
        enqueueSnackbar("Invalid OAuth callback. No token found.", {
          variant: "error",
        });
      }
    };
    handleCallback();
  }, []);
  useEffect(() => {
    if (loading) return;
    if (timer <= 0) {
      navigate(user?.role === "ADMIN" ? "/admin/dashboard" : "/");
      return;
    }
    const timerId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer, navigate, user]);

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
            {loading ? (
              <CircularProgress size={20} className="self-start" />
            ) : (
              <>
                <h1 className="text-lg font-semibold">
                  {user?.fullName || "Unknown User"}
                </h1>
                <p className="text-sm text-neutral-700">{user?.email}</p>
              </>
            )}
            <Button
              variant="contained"
              className="gap-2 bg-white mt-1 rounded-lg text-dark-900 px-4 w-fit"
              size="small"
            >
              <img src="/icons/icons8-google.svg" className="w-5 h-5" />
              Google
            </Button>
          </div>
        </div>
        <dl className="mt-4">
          <div className="flex items-center justify-between border-b pb-2 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <PermIdentity className="mb-1" />
              <span className="mx-2">Account Status</span>
            </dt>
            <dd className="text-sm font-semibold">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Chip
                  label={user?.status == "ACTIVE" ? "Verified" : "Unverified"}
                  className="bg-green-100 text-green-800"
                />
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between border-b pb-2 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <EmailOutlined className="mb-1" />
              <span className="mx-2">Email Verified</span>
            </dt>
            <dd className="text-sm font-semibold">
              {loading ? (
                <CircularProgress size={20} />
              ) : user?.status == "ACTIVE" ? (
                <TaskAlt className="text-green-600" />
              ) : (
                <Cancel className="text-red-600" />
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between border-b pb-2 mb-4 border-neutral-500">
            <dt className="text-sm text-neutral-600">
              <CalendarMonth className="mb-1" />
              <span className="mx-2">Member Since</span>
            </dt>
            <dd className="text-sm font-semibold">
              {loading ? <CircularProgress size={20} /> : "December 2024"}
            </dd>
          </div>
        </dl>
        <p className=" text-center text-base text-neutral-600 pb-2">
          Redirecting you to your dashboard in{" "}
          {loading ? timer : <CircularProgress size={10} />} seconds...
        </p>
        <div>
          <Button
            variant="contained"
            className="w-full "
            href={user?.role === "ADMIN" ? "/admin/dashboard" : "/profile"}
          >
            Go to Dashboard
          </Button>
          <ButtonGroup className="w-full mt-2">
            <Button
              startIcon={<ContactPhoneOutlined />}
              variant="outlined"
              className="w-full"
              href="/profile"
            >
              Profile
            </Button>
            <Button
              startIcon={<HomeWorkOutlined />}
              variant="outlined"
              className="w-full"
              href="/"
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
