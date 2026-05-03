import { AdminApiWithSession } from "@repo/frontend-sdk";
import { getApiSession } from "../config/api-session";
import { SERVER_URL } from "./api_end_points";

export const adminApiWithSession = new AdminApiWithSession(
  { baseURL: SERVER_URL },
  getApiSession()
);
