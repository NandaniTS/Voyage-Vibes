
import { BookingApiWithSession } from "@repo/frontend-sdk";
import { getApiSession } from "../config/api-session";
import { SERVER_URL } from "./api_end_points";



export const bookingApiWithSession = new BookingApiWithSession(
  {
    baseURL: SERVER_URL,
  }, getApiSession()
);
