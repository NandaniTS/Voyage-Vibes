import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { ApiClientWithSession } from "../base/api-client";
import { Session } from "../base/session";

export type TAnalyticsKpis = {
  totalRevenue: number;
  totalBookings: number;
  activePackages: number;
  avgRating: number;
  totalReviews: number;
};

export type TRecentBooking = {
  _id: string;
  packageTitle: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export type TRecentReview = {
  _id: string;
  packageTitle: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
};

export type TTopPackage = {
  title: string;
  bookings: number;
  revenue: number;
};

export type TMonthlyRevenue = {
  month: string;
  revenue: number;
  bookings: number;
};

export type TAnalyticsResponse = {
  kpis: TAnalyticsKpis;
  recentBookings: TRecentBooking[];
  recentReviews: TRecentReview[];
  topPackages: TTopPackage[];
  monthlyRevenue: TMonthlyRevenue[];
};

export class AnalyticsApiWithSession extends ApiClientWithSession {
  constructor(_config: CreateAxiosDefaults = {}, _session: Session) {
    super(_config, _session);
  }

  async getAnalytics(agentId: string, config: AxiosRequestConfig = {}) {
    return this.makeRequest<TAnalyticsResponse>({
      ...config,
      method: "GET",
      url: `/api/analytics/${agentId}`,
    });
  }
}
