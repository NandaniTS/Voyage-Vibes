import { AuthApi } from "@repo/frontend-sdk";
import { SERVER_URL } from "./api_end_points";



export const authApiWithoutSession = new AuthApi(
  {
    baseURL: SERVER_URL,
  }
);
