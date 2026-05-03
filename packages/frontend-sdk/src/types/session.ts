export type TUpdateTokenCallback = () => Promise<string>;

export type TSession = {
  accessToken: string;
  organizationId?: string;
  updateTokenCallback: TUpdateTokenCallback;
};
