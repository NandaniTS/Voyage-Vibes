import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export class PaymentApiWithSession extends ApiClientWithSession {
    constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async createOrder(data: any, config: AxiosRequestConfig = {}) {
    return this.makeRequest<any>({
      ...config,
      method: "POST",
      url: "/api/payment/create-order",
      data: data
    }) as Promise<any>; // Override the wrapped response type since backend returns direct response
  }

  async verifyPayment(data: any, config: AxiosRequestConfig = {}) {
    return this.makeRequest<any>({
      ...config,
      method: "POST",
      url: "/api/payment/verify",
      data: data
    });
  }

  async getPaymentStatus(orderId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<any>({
      ...config,
      method: "GET",
      url: `/api/payment/status/${orderId}`
    });
  }

  async processRefund(data: any, config: AxiosRequestConfig = {}) {
    return this.makeRequest<any>({
      ...config,
      method: "POST",
      url: "/api/payment/refund",
      data: data
    });
  }

  async getPaymentHistory(userId?: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<any>({
      ...config,
      method: "GET",
      url: "/api/payment/history",
      params: userId ? { userId } : {}
    });
  }
}
