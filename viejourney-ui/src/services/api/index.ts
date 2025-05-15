import { enqueueSnackbar } from "notistack";
import http from "../axios";
import { extractApiData } from "./apiHelpers";
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
    const resp = await http.post(AUTH?.VERIFY, data);
    if (resp) {
      window.location.href = "/auth/login";
      enqueueSnackbar(resp?.data?.message, {
        variant: "success",
      });
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

export const refreshToken = async () => {
  try {
    const resp = await http.post(AUTH?.REFRESH_TOKEN);
    if (resp) {
      localStorage.setItem("token", JSON.stringify(resp?.data?.data));
      enqueueSnackbar("Token refreshed successfully", {
        variant: "success",
      });
      return extractApiData<RefreshTokenRespDTO>(resp);
    }
  } catch (error) {
    console.error(error);
  }
};
