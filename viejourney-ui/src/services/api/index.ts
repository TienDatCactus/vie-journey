import http from "../axios";
import { USER } from "./url";

export const doLogin = async (data: { email: string; password: string }) => {
  try {
    const resp = await http.post(USER?.LOGIN, data);
    if (resp) {
      localStorage.setItem("token", resp?.data);
    }
    return resp?.data;
  } catch (error) {
    console.table(error);
    return error;
  }
};

export const doRegister = async (data: {
  email: string;
  password: string;
  rePassword: string;
}) => {
  try {
    const resp = await http.post(USER?.REGISTER, data);
    if (resp) {
      window.location.href = "/login";
    }
    return resp?.data;
  } catch (error) {
    console.table(error);
    return error;
  }
};
export const doLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
