import axios from "axios";
import { enqueueSnackbar } from "notistack";
import http from "../axios";
import { extractApiData } from "./apiHelpers";
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
import { clearToken } from "./token";
import { AUTH, USER } from "./url";

export const doLogin = async (data: LoginReqDTO) => {
  try {
    const resp = await http.post(AUTH?.LOGIN, data);
    const tokenData = extractApiData<LoginRespDTO>(resp);
    if (tokenData && tokenData.accessToken) {
      // Store only access token related data in localStorage
      // Refresh token is now handled via HTTP-only cookies
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
      enqueueSnackbar("Check your email for verification link", {
        variant: "success",
      });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    }
    return extractApiData<RegisterRespDTO>(resp);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const doVerify = async (
  data: VerifyReqDTO,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    if (!data.token) {
      enqueueSnackbar("Verification token is missing", { variant: "error" });
      return null;
    }
    const resp = await http.get(`${AUTH?.VERIFY}?token=${data.token}`);
    if (resp) {
      setLoading(false);
    }
    return resp;
  } catch (error) {
    setError(true);
    setLoading(false);
  }
};
export const doLogout = async (data: LogoutReqDTO) => {
  try {
    // The backend will clear the refresh token cookie
    await http.post(AUTH?.LOGOUT, data);
    // Clear access token from localStorage
    localStorage.removeItem("token");
    // Notify auth context that logout has occurred
    window.dispatchEvent(new CustomEvent("auth:logout"));
  } catch (error) {
    console.error(error);
    // Even if the server call fails, clear client-side tokens
    localStorage.removeItem("token");
    window.dispatchEvent(new CustomEvent("auth:logout"));
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
    console.log(
      "Attempting to refresh access token using HTTP-only refresh token cookie"
    );

    // Create a new axios instance without interceptors to avoid infinite loops
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_PRIVATE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Critical: needed to send and receive cookies
    });

    // Call the refresh endpoint - refresh token is sent automatically via HTTP-only cookie
    const resp = await axiosInstance.post(AUTH?.REFRESH_TOKEN);

    const newTokenData = extractApiData<RefreshTokenRespDTO>(resp);

    if (newTokenData && newTokenData.accessToken) {
      // Store the new access token data (refresh token remains as HTTP-only cookie)
      localStorage.setItem("token", JSON.stringify(newTokenData));
      console.log("Token refreshed successfully");
      return newTokenData;
    } else {
      console.error("Invalid token response format");
      clearToken();
      // Trigger redirect to login in case of refresh failure
      window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearToken();

    // Only dispatch the auth failure event for 401/403 errors
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      // Notify the app that authentication failed
      window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
    }

    return null;
  }
};
