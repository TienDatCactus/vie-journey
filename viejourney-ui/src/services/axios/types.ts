import { AxiosRequestConfig } from "axios";

export interface ErrorHandlerOptions {
  redirectOnUnauthorized?: boolean;
  loginRedirectPath?: string;
  defaultSystemErrorMessage?: string;
  logger?: (msg: string, error?: any) => void;
  authErrorExceptions?: string[];
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export interface RefreshResult {
  accessToken: string;
}
