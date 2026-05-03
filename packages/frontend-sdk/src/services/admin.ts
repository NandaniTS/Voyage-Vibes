import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";
import { TUser } from "@repo/definitions";

export type TUsersListResponse = {
  data: TUser[];
  totalItems: number;
};

export class AdminApiWithSession extends ApiClientWithSession {
  constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async getUsers(userType?: "agent" | "traveller", config: AxiosRequestConfig = {}) {
    return this.makeRequest<TUsersListResponse>({
      ...config,
      method: "GET",
      url: "/api/admin/users",
      params: userType ? { userType } : {},
    });
  }

  async updateBankDetails(
    data: { accountHolderName: string; accountNumber: string; bankName: string; ifscCode: string },
    config: AxiosRequestConfig = {}
  ) {
    return this.makeRequest<TUser>({
      ...config,
      method: "PUT",
      url: "/api/admin/bank-details",
      data,
    });
  }

  async getMe(config: AxiosRequestConfig = {}) {
    return this.makeRequest<TUser>({
      ...config,
      method: "GET",
      url: "/api/admin/me",
    });
  }

  async suspendUser(id: string, isSuspended: boolean, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TUser>({
      ...config,
      method: "PUT",
      url: `/api/admin/users/${id}/suspend`,
      data: { isSuspended },
    });
  }
}
