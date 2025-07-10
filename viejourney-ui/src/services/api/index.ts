import { enqueueSnackbar } from "notistack";
import http from "../axios";
import { extractApiData } from "./apiHelpers";
import {
  CreateTripDto,
  CreateTripRespDto,
  GetTripRespDto,
  GetUserInfoRespDTO,
  GetUserReqDTO,
  GetUserRespDTO,
  LoginReqDTO,
  LoginRespDTO,
  LogoutReqDTO,
  RegisterReqDTO,
  RegisterRespDTO,
  VerifyReqDTO,
} from "./dto";
import { setToken } from "./token";
import { AUTH, TRIP, USER } from "./url";
import { ITrip } from "../../utils/interfaces/trip";

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

export async function refreshToken() {
  try {
    const res = await http.post(AUTH?.REFRESH_TOKEN);
    return res.data; // should be { accessToken }
  } catch (e) {
    return null;
  }
}

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
    console.log(data);
    const resp = await http.post(TRIP?.CREATE_TRIP, data);
    if (resp) {
      const trip = extractApiData<CreateTripRespDto>(resp);
      if (!trip) {
        enqueueSnackbar("Failed to create trip", { variant: "error" });
        return null;
      }
      enqueueSnackbar("Trip created successfully", { variant: "success" });
      window.location.href = `/trips/edit/${trip?._id}`;
      return trip;
    }
  } catch (error) {
    console.error(error);
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

export const doGetUserInfo = async (userId: string) => {
  try {
    const resp = await http.get(`${USER?.GET_USER_INFO}/${userId}`);
    if (resp) {
      return extractApiData<GetUserInfoRespDTO>(resp);
    }
  } catch (error) {
    console.error("Failed to get user info:", error);
  }
  return null;
};

export const doInviteTripMate = async (tripId: string, email: string) => {
  try {
    const resp = await http.post(`${TRIP?.INVITE}`, {
      tripId: tripId,
      email: email.trim().toLowerCase(),
    });
    if (resp) {
      enqueueSnackbar("Trip mate invited successfully", { variant: "success" });
      return true;
    }
  } catch (error) {
    console.error("Failed to invite trip mate:", error);
    enqueueSnackbar("Failed to invite trip mate", { variant: "error" });
  }
  return false;
};

export const doGetTripList = async (): Promise<ITrip[]> => {
  try {
    const res = await http.get(`${TRIP.GET_TRIP}`);
    if (!res || !res.data) {
      console.error("No data received from getTripList");
      return [];
    }
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const doGetUserTripList = async (): Promise<ITrip[]> => {
  try {
    const res = await http.get(`${TRIP.GET_USER_TRIP}`);
    if (!res || !res.data) {
      console.error("No data received from getUserTripList");
      return [];
    }
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
