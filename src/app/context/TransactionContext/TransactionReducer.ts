import { TransactionEvent } from "./TransactionContext";
import { TransactionState } from "./types";

export function transactionReducer(
  state: TransactionState,
  event: TransactionEvent,
): TransactionState {
  if (event.type === "reset") {
    return {
      status: null,
    };
  }

  switch (state.status) {
    case null:
      if (event.type === "idle") {
        return {
          status: "idle",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    case "idle":
      if (event.type === "idle") {
        return {
          status: "success",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      if (event.type === "pending") {
        return {
          ...state,
          status: "pending",
        };
      }
      return state;
    case "pending":
      if (event.type === "success") {
        return {
          ...state,
          status: "success",
        };
      }
      if (event.type === "error") {
        return {
          ...state,
          status: "error",
        };
      }
      return state;
    case "success":
      if (event.type === "idle") {
        return {
          status: "idle",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    case "error":
      if (event.type === "idle") {
        return {
          status: "idle",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    default:
      return state;
  }
}
