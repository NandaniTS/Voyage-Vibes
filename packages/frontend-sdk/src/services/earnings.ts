import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export type TBankDetail = {
  _id?: string;
  agentId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
};

export type TEarningItem = {
  _id: string;
  tripTitle: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  numberOfTravellers: number;
};

export type TEarningsSummary = {
  totalEarnings: number;
  totalPaid: number;
  totalPending: number;
  platformFee: number;
  netEarnings: number;
  commissionRate: number;
};

export type TMonthlyPayout = {
  month: string;
  amount: number;
  status: string;
  date: string | null;
};

export type TEarningsResponse = {
  earnings: TEarningItem[];
  monthlyPayouts: TMonthlyPayout[];
  summary: TEarningsSummary;
};

export class EarningsApiWithSession extends ApiClientWithSession {
  constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async getEarnings(agentId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TEarningsResponse>({
      ...config,
      method: "GET",
      url: `/api/earnings/${agentId}`,
    });
  }

  async getBankDetails(agentId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TBankDetail | null>({
      ...config,
      method: "GET",
      url: `/api/earnings/bank/${agentId}`,
    });
  }

  async saveBankDetails(data: TBankDetail, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TBankDetail>({
      ...config,
      method: "POST",
      url: "/api/earnings/bank",
      data,
    });
  }

  async updateBankDetails(agentId: string, data: Omit<TBankDetail, "agentId" | "_id">, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TBankDetail>({
      ...config,
      method: "PUT",
      url: `/api/earnings/bank/${agentId}`,
      data,
    });
  }
}
