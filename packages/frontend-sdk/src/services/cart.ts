import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";
import { AddToCartRequest, RemoveFromCartRequest, CartPackageItem } from "@repo/definitions";

export class CartApiWithSession extends ApiClientWithSession {
  constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async addToCart(data: AddToCartRequest, config: AxiosRequestConfig = {}) {
    return this.makeRequest({
      ...config,
      method: "POST",
      url: "/api/carts/add",
      data: data,
    });
  }

  async removeFromCart(data: RemoveFromCartRequest, config: AxiosRequestConfig = {}) {
    return this.makeRequest({
      ...config,
      method: "DELETE",
      url: "/api/carts/remove",
      data: data,
    });
  }

  async getUserCart(userId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest({
      ...config,
      method: "GET",
      url: `/api/carts/user/${userId}`,
    });
  }

  async clearCart(userId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest({
      ...config,
      method: "DELETE",
      url: `/api/carts/clear/${userId}`,
    });
  }
}
