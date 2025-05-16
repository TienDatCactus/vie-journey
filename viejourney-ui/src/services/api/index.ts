import { enqueueSnackbar } from "notistack";
import axios from "axios";
import http from "../axios";
import { extractApiData } from "./apiHelpers";
import { getToken, clearToken } from "./token";
import { AUTH, USER } from "./url";
import {
  GetUserReqDTO,
  GetUserRespDTO,
  LoginReqDTO,
  LoginRespDTO,
  LogoutReqDTO,
  RefreshTokenRespDTO,
  RegisterReqDTO,
  RegisterRespDTO,
  VerifyReqDTO,
} from "./dto";

export const doLogin = async (data: LoginReqDTO) => {
  try {
    const resp = await http.post(AUTH?.LOGIN, data);
    const tokenData = extractApiData<LoginRespDTO>(resp);
    if (tokenData && tokenData.accessToken) {
      localStorage.setItem("token", JSON.stringify(tokenData));
    }
    return tokenData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const doRegister = async (data: RegisterReqDTO) => {
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
    return extractApiData<RegisterRespDTO>(resp);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const doVerify = async (data: VerifyReqDTO) => {
  try {
    const resp = await http.get(`${AUTH?.VERIFY}?token=${data.token}`);
    if (resp) {
      window.location.href = "/auth/login";
    }
    return extractApiData(resp);
  } catch (error) {
    return error;
  }
};
export const doLogout = async (data: LogoutReqDTO) => {
  try {
    await http.post(AUTH?.LOGOUT, data);
    localStorage.removeItem("token");
    enqueueSnackbar("Logout successful", {
      variant: "success",
    });
    window.location.href = "/auth/login";
  } catch (error) {
    console.error(error);
  }
};

export const doGetUser = async (data: GetUserReqDTO) => {
  try {
    const resp = await http.post(USER?.GET_PROFILE, data);
    if (resp) {
      return extractApiData<GetUserRespDTO>(resp);
    }
  } catch (error) {
    console.error(error);
  }
};

export const refreshToken = async (): Promise<RefreshTokenRespDTO | null> => {
  try {
    // Get current token
    const currentToken = getToken();
    if (!currentToken?.refreshToken) {
      console.error("No refresh token available");
      clearToken();
      return null;
    }

    // Create a new axios instance without interceptors to avoid infinite loops
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_PRIVATE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Call the refresh endpoint with current refresh token
    const resp = await axiosInstance.post(AUTH?.REFRESH_TOKEN, {
      refreshToken: currentToken.refreshToken,
    });

    const newTokenData = extractApiData<RefreshTokenRespDTO>(resp);

    if (newTokenData && newTokenData.accessToken) {
      // Store the new token
      localStorage.setItem("token", JSON.stringify(newTokenData));
      console.log("Token refreshed successfully");
      return newTokenData;
    } else {
      console.error("Invalid token response format");
      clearToken();
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearToken();
    return null;
  }
};
