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
  GET_USER_DETAIL: "/admin/users/:id",
  FILTER_USERS: "/admin/users/filter",
  PAGINATE_ACCOUNTS: "/admin/userInfo/paginate",
  UPDATE_STATUS: "/admin/accounts/updateActive/:id",
  DELETE_USER: "/admin/userInfo/:id",
  UPDATE_USER_INFO: "/admin/userInfo/:id",
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
  GET_ASSET: "/assets",
  UPDATE_ASSET: "/update-asset",
  DELETE_ASSET: "/assets/delete",
  UPDATE_USER_ROLE: "/admin/users/:id/role",
  BULK_UPDATE_USER_ROLES: "/admin/users/bulk-update-roles",
};
export const TRIP = {
  UPDATE_TRIP_DATES: "/trip/update-dates",
  UPDATE_TRIP_COVER: "/trip/update-cover-image",
  VALIDATE_INVITE: "/trip/validate-invite",
  GET_PLAN_BY_TRIP_ID: "/trip/plan",
  REMOVE_TRIP_MATE: "/trip/remove-tripmate",
  INVITE: "/trip/invite",
  GET_TRIP: "/trip",
  GET_USER_TRIP: "/trip/by-user",
  CREATE_TRIP: "/trip",
  UPDATE_TRIP: "/trip/update",
  DELETE_TRIP: "/trip/delete",
};

export const ASSET = {
  GET_USER_ASSETS: "/assets/content/by-user",
  UPLOAD: "/assets",
  LANDING: "/assets/landing",
};

export const BLOG = {
  LIST_BLOGS: "/blogs/manager",
  BLOGS: "/blogs",
};

export const COMMENT = {
  COMMENTS: "/comments",
};
