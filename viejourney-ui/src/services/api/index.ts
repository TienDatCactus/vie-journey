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
import { AUTH, TRIP, USER, ACCOUNTS, HOTELS, ADMIN, ASSET } from "./url";
import { Trip } from "../stores/storeTypes";

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
      window.location.href = `/trips/plan/${trip?._id}`;
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

export const doGetTripList = async (): Promise<Trip[]> => {
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

export const doGetUserTripList = async (): Promise<Trip[]> => {
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

export const doRemoveTripMate = async (tripId: string, email: string) => {
  try {
    const resp = await http.post(`${TRIP?.REMOVE_TRIP_MATE}`, {
      tripId: tripId,
      email: email.trim().toLowerCase(),
    });
    if (resp) {
      enqueueSnackbar("Trip mate removed successfully", { variant: "success" });
      return true;
    }
  } catch (error) {
    console.error("Failed to remove trip mate:", error);
  }
};

export const doGetPlanByTripId = async (tripId: string) => {
  try {
    const resp = await http.get(`${TRIP?.GET_PLAN_BY_TRIP_ID}/${tripId}`);
    if (!resp || !resp.data) {
      console.error("No data received from getPlanByTripId");
      return null;
    }
    return resp.data;
  } catch (error) {
    console.error("Failed to get plan by trip ID:", error);
  }
  return null;
};

export const doValidateInvite = async (tripId: string, token: string) => {
  try {
    const resp = await http.post(TRIP?.VALIDATE_INVITE, {
      tripId: tripId,
      token: token,
    });
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.error("Failed to validate invite:", error);
    return null;
  }
};

// ============ ACCOUNT MANAGEMENT APIs ============

export const doGetAllUsers = async () => {
  try {
    const resp = await http.get(ACCOUNTS.GET_ACCOUNTS);
    return resp.data;
  } catch (error) {
    console.error("Failed to get all users:", error);
    throw error;
  }
};

export const doFilterUsers = async (filter: {
  role?: string;
  status?: string;
  username?: string;
  email?: string;
}) => {
  try {
    const resp = await http.get(ACCOUNTS.FILTER_USERS, {
      params: filter,
    });
    return resp.data;
  } catch (error) {
    console.error("Failed to filter users:", error);
    throw error;
  }
};

export const doUpdateAccountStatus = async (
  accountId: string,
  active: boolean
) => {
  try {
    const resp = await http.patch(
      ACCOUNTS.UPDATE_STATUS.replace(":id", accountId),
      { active }
    );
    return resp.data;
  } catch (error) {
    console.error("Failed to update account status:", error);
    throw error;
  }
};

export const doUpdateUserRole = async (accountId: string, role: string) => {
  try {
    const resp = await http.patch(
      ADMIN.UPDATE_USER_ROLE.replace(":id", accountId),
      {
        role,
      }
    );
    return resp.data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

export const doBulkUpdateUserRoles = async (
  userIds: string[],
  role: string
) => {
  try {
    const resp = await http.patch(ADMIN.BULK_UPDATE_USER_ROLES, {
      userIds,
      role,
    });
    return resp.data;
  } catch (error) {
    console.error("Failed to bulk update user roles:", error);
    throw error;
  }
};

export const doGetUserDetail = async (userId: string) => {
  try {
    const resp = await http.get(
      ACCOUNTS.GET_USER_DETAIL.replace(":id", userId)
    );
    return resp.data;
  } catch (error) {
    console.error("Failed to get user detail:", error);
    throw error;
  }
};

export const doDeleteUser = async (userId: string) => {
  try {
    const resp = await http.delete(ACCOUNTS.DELETE_USER.replace(":id", userId));
    return resp.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

export const doUpdateUserInfo = async (
  userId: string,
  data: {
    fullName: string;
    dob: string;
    phone: string;
    address: string;
  }
) => {
  try {
    const resp = await http.patch(
      ACCOUNTS.UPDATE_USER_INFO.replace(":id", userId),
      data
    );
    return resp.data;
  } catch (error) {
    console.error("Failed to update user info:", error);
    throw error;
  }
};

// ============ HOTEL MANAGEMENT APIs ============

export const doGetAllHotels = async () => {
  try {
    const resp = await http.get(HOTELS.GET_HOTELS);
    return resp.data;
  } catch (error) {
    console.error("Failed to get all hotels:", error);
    throw error;
  }
};

export const doGetHotelById = async (hotelId: string) => {
  try {
    const resp = await http.get(HOTELS.GET_HOTEL.replace(":id", hotelId));
    return resp.data;
  } catch (error) {
    console.error("Failed to get hotel by id:", error);
    throw error;
  }
};

export const doCreateHotel = async (hotelData: {
  name: string;
  address: string;
  city: string;
  description?: string;
  rating?: number;
}) => {
  try {
    const resp = await http.post(HOTELS.CREATE_HOTEL, hotelData);
    return resp.data;
  } catch (error) {
    console.error("Failed to create hotel:", error);
    throw error;
  }
};

export const doUpdateHotel = async (
  hotelId: string,
  hotelData: {
    hotelId: string;
    name?: string;
    address?: string;
    city?: string;
    description?: string;
    rating?: number;
  }
) => {
  try {
    const resp = await http.patch(
      HOTELS.UPDATE_HOTEL.replace(":id", hotelId),
      hotelData
    );
    return resp.data;
  } catch (error) {
    console.error("Failed to update hotel:", error);
    throw error;
  }
};

export const doDeleteHotel = async (hotelId: string) => {
  try {
    const resp = await http.delete(HOTELS.DELETE_HOTEL.replace(":id", hotelId));
    return resp.data;
  } catch (error) {
    console.error("Failed to delete hotel:", error);
    throw error;
  }
};

export const doImportHotels = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const resp = await http.post(HOTELS.IMPORT_HOTEL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp.data;
  } catch (error) {
    console.error("Failed to import hotels:", error);
    throw error;
  }
};

export const doGetUserContentAssets = async () => {
  try {
    const resp = await http.get(`${ASSET.GET_USER_ASSETS}`);
    if (resp) {
      return resp.data;
    }
  } catch (error) {
    console.error("Failed to get user content assets:", error);
  }
  return [];
};

export const updateTripDates = async (
  tripId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const resp = await http.post(`${TRIP?.UPDATE_TRIP_DATES}`, {
      tripId: tripId,
      startDate: startDate,
      endDate: endDate,
    });
    if (resp.status > 200 && resp.status < 300) {
      return resp.data;
    }
  } catch (error) {
    console.error("Failed to update trip dates:", error);
  }
};

export const doAddContentAsset = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "CONTENT");
    const res = await http.post(ASSET.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status >= 200 && res.status < 300) {
      enqueueSnackbar("Asset uploaded successfully", { variant: "success" });
      return res.data;
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar("Failed to upload asset", { variant: "error" });
  }
};

export const doUpdateTripCover = async (tripId: string, assetId: string) => {
  try {
    const resp = await http.post(`${TRIP?.UPDATE_TRIP_COVER}`, {
      tripId: tripId,
      assetId: assetId,
    });
    if (resp.status >= 200 && resp.status < 300) {
      enqueueSnackbar("Trip cover updated successfully", {
        variant: "success",
      });
      return resp.data;
    }
  } catch (error) {
    console.error("Failed to update trip cover:", error);
    enqueueSnackbar("Failed to update trip cover", { variant: "error" });
  }
  return null;
};
