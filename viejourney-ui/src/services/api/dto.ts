export interface LoginReqDTO {
  email: string;
  password: string;
}

export interface LoginRespDTO {
  userId: string;
  accessToken: string;
  expiresIn: number;
  expiredAt: Date;
  statusCode: number;
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

export interface GetUserRespDTO {
  userId: string;
  email: string;
  role: string;
  active: boolean;
}

export interface RefreshTokenRespDTO {
  userId: string;
  accessToken: string;
  expiresIn: number;
  expiredAt: Date;
}

export interface GetUserReqDTO {
  userId: string;
}
