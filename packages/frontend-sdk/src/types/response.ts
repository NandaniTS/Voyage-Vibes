// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TResponseType<T = any> = {
  success: boolean;
  message: string;
  data: T;
};
