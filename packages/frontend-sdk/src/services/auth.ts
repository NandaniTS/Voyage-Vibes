import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithoutSession } from "../base/api-client";
import { TCreateUserRequest, TCreateUserResponse, TLogInRequest, TUser } from "@repo/definitions";

export type TLoginApiResponse = {
  user: TUser;
  token: string;
};

export class AuthApi extends ApiClientWithoutSession {
  constructor(_config: CreateAxiosDefaults = {}) {
    super(_config);
  }

  async user_login(
    data: TLogInRequest,
    config: AxiosRequestConfig = {},
  ) {
    return this.makeRequest<TLoginApiResponse>({
      ...config,
      method: "POST",
      url: "/api/auth/login",
      data: data,
    });
  }

    async signup(
    data: TCreateUserRequest,
    config: AxiosRequestConfig = {},
  ) {
    return this.makeRequest<TCreateUserResponse>({
      ...config,
      method: "POST",
      url: "/api/auth/signup",
      data: data,
    });
  }

  async changePassword(
    data: { currentPassword: string; newPassword: string },
    token: string,
    config: AxiosRequestConfig = {},
  ) {
    return this.makeRequest<{ message: string }>({
      ...config,
      method: "POST",
      url: "/api/auth/change-password",
      data,
      headers: { Authorization: `Bearer ${token}`, ...config.headers },
    });
  }

}