import { EarningsApiWithSession } from "@repo/frontend-sdk";
import { getApiSession } from "../config/api-session";
import { SERVER_URL } from "./api_end_points";

export const earningsApiWithSession = new EarningsApiWithSession(
  { baseURL: SERVER_URL },
  getApiSession()
);
