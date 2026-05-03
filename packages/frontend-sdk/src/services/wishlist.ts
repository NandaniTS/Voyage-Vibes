import {
  TCreateWishlistRequest,
  TCreateWishlistResponse,
  TGetAllWishlistRequest,
  TGetAllWishlistResponse,
  TUpdateWishlistRequest
} from "@repo/definitions";
import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export class WishlistApiWithSession extends ApiClientWithSession {
  constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async addToWishlist(
    data: TCreateWishlistRequest,
    config: AxiosRequestConfig = {},
  ) {
    return this.makeRequest<TCreateWishlistResponse>({
      ...config,
      method: "POST",
      url: "/api/wishlist/",
      data: data,
    });
  }

  async removeFromWishlist(data:TUpdateWishlistRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TUpdateWishlistRequest>({
      ...config,
      method:"DELETE",
      url: `/api/wishlist/${data._id}`,
      data: { userId: data.userId }
    })
  }

  async getByUserId(data:TGetAllWishlistRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllWishlistResponse>({
      ...config,
      method:"GET",
      url: `/api/wishlist/user/${data?.query?.filters?.userId}`,
      data:data
    })
  }
}
