import { AxiosRequestConfig } from "axios";

export type TMakeRequestAxiosConfig = AxiosRequestConfig & {
  method: "GET" | "POST" | "PUT" | "DELETE";
};
