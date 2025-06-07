import { Account } from "../../utils/interfaces";

export interface LoginReqDTO {
  email: string;
  password: string;
}

export interface LoginRespDTO {
  userId: string;
  accessToken: string;
}

export interface RegisterReqDTO {
  email: string;
  password: string;
  rePassword: string;
}

export interface RegisterRespDTO {
  message: string;
}

export interface VerifyReqDTO {
  token: string;
}
export interface VerifyRespDTO {
  message: string;
  status: "success" | "error";
}
export interface LogoutReqDTO {
  userId: string;
}

export interface GetUserRespDTO extends Account {}

export interface RefreshTokenRespDTO {
  userId: string;
  accessToken: string;
}

export interface GetUserReqDTO {
  userId: string;
}
