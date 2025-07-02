import { Account, Trip, UserInfo } from "../../utils/interfaces";

export interface LoginReqDTO {
  email: string;
  password: string;
}

export interface LoginRespDTO {
  accessToken: string;
  userId: string;
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
export interface GetUserInfoRespDTO extends UserInfo {}
export interface RefreshTokenRespDTO {
  userId: string;
  accessToken: string;
}

export interface GetUserReqDTO {
  userId: string;
}

export interface CreateTripDto {
  destination: {
    id: string;
    name: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
  dates: DateConstructor[];
  travelers:
    | "Solo traveler"
    | "2 travelers"
    | "3 travelers"
    | "4 travelers"
    | "5+ travelers";
  budget?:
    | "Budget ($0 - $500)"
    | "Mid-range ($500 - $1500)"
    | "Luxury ($1500+)";
  description?: string;
  visibility: boolean;
  inviteEmails: string[];
}
export interface CreateTripRespDto extends Trip {}
export interface GetTripRespDto extends Trip {}
