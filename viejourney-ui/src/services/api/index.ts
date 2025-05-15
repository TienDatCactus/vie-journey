import { NavigateFunction } from "react-router-dom";
import http from "../axios";
import { AUTH, USER } from "./url";
import { enqueueSnackbar } from "notistack";

export const doLogin = async (data: { email: string; password: string }) => {
  try {
    const resp = await http.post(AUTH?.LOGIN, data);
    console.log(resp);
    if (resp) {
      localStorage.setItem("token", JSON.stringify(resp?.data?.data));
      enqueueSnackbar("Login successful", {
        variant: "success",
      });
      window.location.href = "/";
    }
    return resp?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const doRegister = async (data: {
  email: string;
  password: string;
  rePassword: string;
}) => {
  try {
    if (data.password !== data.rePassword) {
      enqueueSnackbar("Password and confirm password do not match", {
        variant: "error",
      });
      return;
    }
    const resp = await http.post(AUTH?.REGISTER, data);
    if (resp) {
      window.location.href = "/auth/login";
      enqueueSnackbar("Check your email for verification link", {
        variant: "success",
      });
    }
    return resp?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const doVerify = async (data: { otp: string }) => {
  try {
    const resp = await http.post(AUTH?.VERIFY, data);
    if (resp) {
      window.location.href = "/auth/login";
      enqueueSnackbar(resp?.data?.message, {
        variant: "success",
      });
    }
    return resp?.data;
  } catch (error) {
    return error;
  }
};
export const doLogout = async (data: { userId: string }) => {
  try {
    await http.post(AUTH?.LOGOUT, data);

    localStorage.removeItem("token");
    window.location.href = "/auth/login";
    enqueueSnackbar("Logout successful", {
      variant: "success",
    });
  } catch (error) {
    console.error(error);
  }
};

export const doGetUser = async () => {
  try {
    const resp = await http.post(USER?.GET_PROFILE);
    console.log(resp);
    if (resp) {
      enqueueSnackbar("User profile retrieved successfully", {
        variant: "success",
      });
      return resp?.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const refreshToken = async () => {
  try {
    const resp = await http.post(AUTH?.REFRESH_TOKEN);
    if (resp) {
      localStorage.setItem("token", JSON.stringify(resp?.data?.data));
      enqueueSnackbar("Token refreshed successfully", {
        variant: "success",
      });
      return resp?.data;
    }
  } catch (error) {
    console.error(error);
  }
};
