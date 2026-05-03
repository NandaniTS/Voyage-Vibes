import { jwtDecode } from "jwt-decode";
import { TSession, TUpdateTokenCallback } from "../types";

export class Session {
  private static instance: Session | null = null;
  private accessToken!: string;
  private organizationId!: string | undefined;
  private updateTokenCallback!: TUpdateTokenCallback;

  private constructor(_sessionData?: TSession) {
    if (_sessionData) {
      this.accessToken = _sessionData?.accessToken;
      this.updateTokenCallback = _sessionData.updateTokenCallback;
      if (_sessionData.organizationId)
        this.organizationId = _sessionData.organizationId;
    }
  }

  public static getInstance(_sessionData?: TSession): Session {
    if (!Session.instance) {
      Session.instance = new Session(_sessionData);
    } else if (_sessionData) {
      Session.instance.accessToken = _sessionData.accessToken;
      Session.instance.updateTokenCallback = _sessionData.updateTokenCallback;
      Session.instance.organizationId = _sessionData.organizationId;
    }
    return Session.instance;
  }

  getToken() {
    return this.accessToken;
  }

  setToken(_token: string) {
    this.accessToken = _token;
  }

  private async updateToken() {
    const newAccessToken = await this.updateTokenCallback();
    if (newAccessToken) {
      this.setToken(newAccessToken);
    } else {
      console.error(
        "Failed to refresh token. Update callback returned empty string.",
      );
      // Use setTimeout to avoid interfering with the current call stack
      setTimeout(() => {
        window.location.href = "/";
      }, 0);
    }
  }

  async getValidToken() {
    // console.log(this.accessToken)
    if (!this.accessToken) {
      await this.updateToken();
    }

    if (this.accessToken) {
      try {
        const currentTime = new Date().getTime();
        const decoded = jwtDecode(this.accessToken);
        // console.log(decoded)
        if (decoded.exp && decoded.exp * 1000 - currentTime < 60 * 1000) {
          await this.updateToken();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        await this.updateToken();
      }
    }

    return this.getToken();
  }

  getOrganizationId() {
    return this.organizationId;
  }

  setOrganizationId(_organizationId?: string) {
    this.organizationId = _organizationId;
  }
}
    