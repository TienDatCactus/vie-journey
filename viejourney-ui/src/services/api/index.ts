import axios from "axios";
import { enqueueSnackbar } from "notistack";
import http from "../axios";
import { extractApiData } from "./apiHelpers";
import {
  CreateTripDto,
  CreateTripRespDto,
  GetTripRespDto,
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
import { clearToken, setToken } from "./token";
import { AUTH, TRIP, USER } from "./url";

export const doLogin = async (data: LoginReqDTO) => {
  try {
    const resp = await http.post(AUTH?.LOGIN, data);
    const tokenData = extractApiData<LoginRespDTO>(resp);
    if (tokenData && tokenData.accessToken) {
      setToken(tokenData);
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
  setCurrentState: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    if (!data.token) {
      enqueueSnackbar("Verification token is missing", { variant: "error" });
      return null;
    }
    const resp = await http.get(`${AUTH?.VERIFY}?token=${data.token}`);
    if (resp) {
      setCurrentState({ loading: false, err: false, success: true });
    }
    return resp;
  } catch (error) {
    setCurrentState({ loading: false, err: true, success: false });
  }
};
export const doLogout = async (data: LogoutReqDTO) => {
  try {
    await http.post(AUTH?.LOGOUT, data);
    localStorage.removeItem("token");
    window.dispatchEvent(new CustomEvent("auth:logout"));
  } catch (error) {
    console.error(error);
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
    const resp = await http.post(AUTH?.REFRESH_TOKEN);
    const newTokenData = extractApiData<RefreshTokenRespDTO>(resp);
    console.log(resp);
    if (newTokenData && newTokenData.accessToken) {
      localStorage.setItem("token", JSON.stringify(newTokenData));
      return newTokenData;
    } else {
      clearToken();
      window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearToken();

    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
    }

    return null;
  }
};

export const doResendVerificationEmail = async (email: string) => {
  try {
    const resp = await http.post(AUTH?.RESEND_VERIFICATION_EMAIL, { email });
    if (resp) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const doSendForgotPasswordEmail = async (email: string) => {
  try {
    const resp = await http.post(AUTH?.SEND_FORGOT_PASSWORD_EMAIL, { email });
    if (resp) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const doForgotPassword = async (token: string, password: string) => {
  try {
    const resp = await http.post(AUTH?.FORGOT_PASSWORD, { token, password });
    if (resp) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const doLoginWithGoogle = () => {
  try {
    window.location.href = `${import.meta.env.VITE_PRIVATE_URL}/auth/google`;
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
  return null;
};

export const doValidateAccessToken = async (accessToken: string) => {
  try {
    const resp = await http.post(AUTH?.VALIDATE_ACCESS_TOKEN, {
      token: accessToken,
    });
    if (resp) {
      return extractApiData<{
        userId: string;
      }>(resp);
    }
  } catch (error) {
    console.error(error);
  }
};

export const doCreateTrip = async (data: CreateTripDto) => {
  try {
    const resp = await http.post(TRIP?.CREATE_TRIP, data);
    if (resp) {
      const trip = extractApiData<CreateTripRespDto>(resp);
      enqueueSnackbar("Trip created successfully", { variant: "success" });
      window.location.href = `/trip/${trip?._id}`;
      return trip;
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar("Failed to create trip", { variant: "error" });
  }
  return null;
};

export const doGetTrip = async (tripId: string) => {
  try {
    const resp = await http.get(`${TRIP?.GET_TRIP}/${tripId}`);
    if (resp) {
      return extractApiData<GetTripRespDto>(resp);
    }
  } catch (error) {
    console.error("Failed to get trip:", error);
  }
  return null;
};
