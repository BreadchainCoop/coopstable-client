export type TransactionType = "mint" | "burn";
export type TransactionStatus = "init" | "submitted" | "success" | "error";

export type TransactionStateNull = { status: null };
export type TransactionStateInit = {
  status: Extract<"init", TransactionStatus>;
  type: TransactionType;
  value: string;
};
export type TransactionStateSubmitted = {
  status: Extract<"submitted", TransactionStatus>;
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
  | TransactionStateSubmitted
  | TransactionStateSuccess
  | TransactionStateError;
