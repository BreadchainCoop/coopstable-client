import { NetworkString } from "@/app/services/UserService/types";

export type UserContextStateLoading = {
  status: "loading";
};
export type UserContextStateNotConnected = {
  status: "not_connected";
};
export type UserContextStateConnecting = {
  status: "connecting";
};

export type UserContextStateConnected = {
  status: "connected";
  account: string;
  network: NetworkString;
};
export type UserContextStateError = {
  status: "error";
};

export type UserContextState =
  | UserContextStateLoading
  | UserContextStateConnecting
  | UserContextStateNotConnected
  | UserContextStateConnected
  | UserContextStateError;
