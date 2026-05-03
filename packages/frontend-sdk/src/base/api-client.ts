import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { TMakeRequestAxiosConfig, TResponseType } from "../types";
import { Session } from "./session";

/**
 * ApiClient class provides an interface for making HTTP requests using Axios.
 * It manages Axios instances
 * 1. `axiosInstance`: An instance that includes the Authorization header with the session token.
 *
 * The class also handles request interceptors to attach the session token in all requests
 * and provides methods to make authenticated and open API requests.
 */
export class ApiClientWithSession {
  // Axios instance that includes session token in headers
  protected axiosInstance!: AxiosInstance;

  // Session to manage and retrieve valid access tokens
  private session!: Session;

  /**
   * Constructor for the ApiClient class.
   * It initializes two Axios instances, one with session token management and one without.
   * The session token is attached to the `axiosInstance` via interceptors.
   *
   * @param config - Axios configuration used to initialize the instances.
   * @param _session - Optional session object to manage token retrieval and refreshing.
   */
  constructor(config: CreateAxiosDefaults, _session: Session) {
    //  for cookies
    config.withCredentials = true;

    this.axiosInstance = axios.create(config);
    // if session then do put it in the interceptor
    if (_session) {
      this.session = _session;
    }
    this.requestInterceptor();
  }

  private requestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // console.log("HAA YAHA AAYE", this.session, config.headers.Authorization)
        const token = await this.session.getValidToken();
        config.headers.Authorization = `Bearer ${config.headers.Authorization || token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /**
   * Makes an authenticated request using the `axiosInstance`.
   * This method is for requests that require a session token for authentication.
   *
   * @param config - Axios request configuration object.
   * @returns The response data of the request.
   */
  protected async makeRequest<T>(
    config: TMakeRequestAxiosConfig,
  ): Promise<TResponseType<T>> {
    const response = await this.axiosInstance<TResponseType<T>>(config);
    return response.data;
  }
}

/**
 * ApiClient class provides an interface for making HTTP requests using Axios.
 * It manages  Axios instances:
 * 1. `axiosInstanceOpen`: An instance without session information, used for open requests.
 *
 * The class also handles request interceptors to attach the session token in all requests
 * and provides methods to make authenticated and open API requests.
 */
export class ApiClientWithoutSession {
  // Axios instance that does not include session token in headers (for open requests)
  protected axiosInstance!: AxiosInstance;

  constructor(config: CreateAxiosDefaults) {
    //  for cookies
    config.withCredentials = true;
    // create instance
    this.axiosInstance = axios.create(config);
  }

  /**
   * Makes an open (unauthenticated) request using the `axiosInstanceOpen`.
   * This method is for requests that don't require a session token.
   *
   * @param config - Axios request configuration object.
   * @returns The response data of the request.
   */
  public async makeRequest<T>(
    config: TMakeRequestAxiosConfig,
  ): Promise<TResponseType<T>> {
    const response = await this.axiosInstance<TResponseType<T>>(config);
    return response.data;
  }
}
