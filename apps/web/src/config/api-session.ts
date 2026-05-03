import { Session } from "@repo/frontend-sdk";
import { getNewToken } from "../utils/helpers/generate-token";

let sessionInstance: Session | null = null;

export function getApiSession(): Session {
  const storedToken = typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  if (!sessionInstance) {
    sessionInstance = Session.getInstance({
      accessToken: storedToken,
      updateTokenCallback: getNewToken,
    });
  } else if (storedToken) {
    sessionInstance.setToken(storedToken);
  }

  return sessionInstance;
}
