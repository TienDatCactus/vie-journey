export const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify-email",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  RESEND_VERIFICATION_EMAIL: "/auth/resend-verification-email",
  SEND_FORGOT_PASSWORD_EMAIL: "/auth/send-forgot-password-email",
  FORGOT_PASSWORD: "/auth/forgot-password",
  GOOGLE_LOGIN: "/auth/google-login",
  VALIDATE_ACCESS_TOKEN: "/auth/validate-token",
  // FORGOT_PASSWORD: "/auth/forgot-password",
  // RESET_PASSWORD: "/auth/reset-password",
};

export const USER = {
  GET_PROFILE: "/account/profile",
};

export const ACCOUNTS = {
  GET_ACCOUNTS: "/admin/userInfo/",
  PAGINATE_ACCOUNTS: "/admin/userInfo/paginate",
};

export const ADMIN = {
  GET_ASSET: "/admin/assets",
  UPDATE_ASSET: "/admin/update-asset",
  DELETE_ASSET: "/admin/assets/delete",
};
export const TRIP = {
  INVITE: "/trips/invite",
  GET_TRIPS: "/trips",
  GET_TRIP: "/trips/:id",
  CREATE_TRIP: "/trips/create",
  UPDATE_TRIP: "/trips/update/:id",
  DELETE_TRIP: "/trips/delete/:id",
  PAGINATE_TRIPS: "/trips/paginate",
};
