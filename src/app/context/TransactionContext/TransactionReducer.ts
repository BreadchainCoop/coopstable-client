import { TransactionEvent, TransactionState } from "./TransactionContext";

export function transactionReducer(
  state: TransactionState,
  event: TransactionEvent,
): TransactionState {
  switch (state.status) {
    case null:
      if (event.type === "new") {
        return {
          status: "init",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    case "init":
      if (event.type === "new") {
        return {
          status: "success",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      if (event.type === "submitted") {
        return {
          ...state,
          status: "submitted",
        };
      }
      return state;
    case "submitted":
      if (event.type === "success_result") {
        return {
          ...state,
          status: "success",
        };
      }
      if (event.type === "error_result") {
        return {
          ...state,
          status: "error",
        };
      }
      return state;
    case "success":
      if (event.type === "new") {
        return {
          status: "init",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    case "error":
      if (event.type === "new") {
        return {
          status: "init",
          type: event.payload.type,
          value: event.payload.value,
        };
      }
      return state;
    default:
      return state;
  }
}
