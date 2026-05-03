import { TCreateBookingRequest, TCreateBookingResponse, TCreatePackageRequest, TCreatePackageResponse, TCreateUserRequest, TCreateUserResponse, TGetAllBookingRequest, TGetAllBookingResponse, TGetAllPackageRequest, TGetAllPackageResponse, TGetByIdBookingRequest, TGetByIdBookingResponse, TGetByIdPackageRequest, TGetByIdPackageResponse, TLogInRequest, TLogInResponse, TUpdateBookingRequest, TUpdateBookingResponse, TUpdatePackageRequest, TUpdatePackageResponse } from "@repo/definitions";
import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export class BookingApiWithSession extends ApiClientWithSession {
    constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }


  async checkAlreadyBooked(userId: string, packageId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<{ alreadyBooked: boolean }>({
      ...config,
      method: "GET",
      url: `/api/bookings/check/${userId}/${packageId}`,
    });
  }

  async create (data:TCreateBookingRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TCreateBookingResponse>({
        ...config,
        method:"POST",
        url: "/api/bookings",
        data:data
    })
  }

  async update (data:TUpdateBookingRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TUpdateBookingResponse>({
        ...config,
        method:"PUT",
        url: `/api/bookings/${data._id}`,
        data:data
    })
  }

  async get_by_agentId(data:TGetAllBookingRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllBookingResponse>({
        ...config,
        method:"GET",
        url: `/api/bookings/agent/${data?.query?.filters?.agentId}`,
        data:data
    })
  }
  async get_by_userId(data:TGetAllBookingRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllBookingResponse>({
        ...config,
        method:"GET",
        url: `/api/bookings/user/${data?.query?.filters?.userId}`,
        data:data
    })
  }

    async get_by_id (data:TGetByIdBookingRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetByIdBookingResponse>({
        ...config,
        method:"GET",
        url: `/api/bookings/${data._id}`,
        data:data
    })
  }


}