import { Session } from "@repo/frontend-sdk";

// Reads the token stored in localStorage (set during login/signup)
export const getNewToken = async (): Promise<string> => {
  const token = localStorage.getItem("token");
  if (token) {
    Session.getInstance().setToken(token);
    return token;
  }
  // No token available — redirect to login
  localStorage.removeItem("user");
  // Use setTimeout to avoid interfering with the current call stack
  setTimeout(() => {
    window.location.href = "/";
  }, 0);
  return "";
};

export const logout = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // Use setTimeout to avoid interfering with the current call stack
  setTimeout(() => {
    window.location.href = "/";
  }, 0);
};
