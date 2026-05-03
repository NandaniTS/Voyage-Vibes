import { TCreatePackageRequest, TCreatePackageResponse, TCreateUserRequest, TCreateUserResponse, TGetAllPackageRequest, TGetAllPackageResponse, TGetByIdPackageRequest, TGetByIdPackageResponse, TLogInRequest, TLogInResponse, TUpdatePackageRequest, TUpdatePackageResponse } from "@repo/definitions";
import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export class PackageApiWithSession extends ApiClientWithSession {
    constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }


  async create (data:TCreatePackageRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TCreatePackageResponse>({
        ...config,
        method:"POST",
        url: "/api/packages",
        data:data
    })
  }

  async update (data:TUpdatePackageRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TUpdatePackageResponse>({
        ...config,
        method:"PUT",
        url: `/api/packages/${data._id}`,
        data:data
    })
  }

  async get (data:TGetAllPackageRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllPackageResponse>({
        ...config,
        method:"GET",
        url: "/api/packages",
        params:data
    })
  }

    async get_by_id (data:TGetByIdPackageRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetByIdPackageResponse>({
        ...config,
        method:"GET",
        url: `/api/packages/${data._id}`,
        data:data
    })
  }


}