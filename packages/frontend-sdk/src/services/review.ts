import { TCreateReviewRequest, TCreateReviewResponse, TGetAllReviewRequest, TGetAllReviewResponse, TGetByIdReviewRequest, TGetByIdReviewResponse, TUpdateReviewRequest, TUpdateReviewResponse } from "@repo/definitions";
import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export class ReviewApiWithSession extends ApiClientWithSession {
    constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }


  async create (data:TCreateReviewRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TCreateReviewResponse>({
        ...config,
        method:"POST",
        url: "/api/reviews",
        data:data
    })
  }

  async update (data:TUpdateReviewRequest,  config: AxiosRequestConfig = {}){
    return this.makeRequest<TUpdateReviewResponse>({
        ...config,
        method:"PUT",
        url: `/api/reviews/${data._id}`,
        data:data
    })
  }

  async get_by_agentId (data:TGetAllReviewRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllReviewResponse>({
        ...config,
        method:"GET",
        url: `/api/reviews/agent/${data.query?.filters?.agentId}`,
        data:data
    })
  }

    async get_by_userId (data:TGetAllReviewRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetAllReviewResponse>({
        ...config,
        method:"GET",
        url: `/api/reviews/user/${data.query?.filters?.userId}`,
        data:data
    })
  }

    async get_by_id (data:TGetByIdReviewRequest, config: AxiosRequestConfig = {}){
    return this.makeRequest<TGetByIdReviewResponse>({
        ...config,
        method:"GET",
        url: `/api/reviews/${data._id}`,
        data:data
    })
  }


}