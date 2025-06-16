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
  GET_USER_INFO: "/user",
};

export const ACCOUNTS = {
  GET_ACCOUNTS: "/admin/userInfo/",
  PAGINATE_ACCOUNTS: "/admin/userInfo/paginate",
};

export const ADMIN = {
  GET_ASSET: "/admin/assets",
  UPDATE_ASSET: "/admin/update-asset",
  DELETE_ASSET: "/admin/assets/delete",
  CHAGE_ROLE: "/admin/:id/role",
};
export const TRIP = {
  INVITE: "/trip/invite",
  GET_TRIPS: "/trip",
  GET_TRIP: "/trip",
  CREATE_TRIP: "/trip",
  UPDATE_TRIP: "/trip/update",
  DELETE_TRIP: "/trip/delete",
};
