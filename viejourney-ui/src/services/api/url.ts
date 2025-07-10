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
  UPDATE: "/user/edit-profile",
  EDIT_AVATAR: "/user/edit-avatar",
};

export const ACCOUNTS = {
  GET_ACCOUNTS: "/admin/users",
  FILTER_USERS: "/admin/users/filter",
  PAGINATE_ACCOUNTS: "/admin/userInfo/paginate",
  UPDATE_STATUS: "/admin/accounts/updateActive/:id",
};

export const HOTELS = {
  GET_HOTELS: "/manager/hotel",
  GET_HOTEL: "/manager/hotel/:id",
  CREATE_HOTEL: "/manager/hotel/add",
  UPDATE_HOTEL: "/manager/hotel/:id",
  DELETE_HOTEL: "/manager/hotel/:id",
  IMPORT_HOTEL: "/manager/hotel/import",
};

export const ADMIN = {
  GET_ASSET: "/admin/assets",
  UPDATE_ASSET: "/admin/update-asset",
  DELETE_ASSET: "/admin/assets/delete",
  CHAGE_ROLE: "/admin/:id/role",
};
export const TRIP = {
  REMOVE_TRIP_MATE: "/trip/remove-tripmate",
  INVITE: "/trip/invite",
  GET_TRIP: "/trip",
  GET_USER_TRIP: "/trip/by-user",
  CREATE_TRIP: "/trip",
  UPDATE_TRIP: "/trip/update",
  DELETE_TRIP: "/trip/delete",
};

export const ASSET = {
  UPLOAD: "/assets/image",
  LANDING: "/assets/landing",
};

export const BLOG = {
  LIST_BLOGS: "/blogs/manager",
  BLOGS: "/blogs",
};
