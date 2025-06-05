import { SwapMode } from "@/app/components/Swap/SwapContext";

export type TransactionType = SwapMode;
export type TransactionStatus = "idle" | "pending" | "success" | "error";    

export type TransactionStateNull = { status: null };
export type TransactionStateInit = {
  status: Extract<"idle", TransactionStatus>;
  type: TransactionType;
  value: string;
};
export type TransactionStateLoading = {
  status: Extract<"pending", TransactionStatus>;
  type: TransactionType;
  value: string;
};
export type TransactionStateSuccess = {
  status: Extract<"success", TransactionStatus>;
  type: TransactionType;
  value: string;
};
export type TransactionStateError = {
  status: Extract<"error", TransactionStatus>;
  type: TransactionType;
  value: string;
};

export type TransactionState =
  | TransactionStateNull
  | TransactionStateInit
  | TransactionStateLoading
  | TransactionStateSuccess
  | TransactionStateError;
