import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { DialogContent, DialogOverlay } from "@/app/components/Dialog/Dialog";
import { TransactionDialog } from "@/app/components/Dialog/TransactionDialog";
import { transactionReducer } from "./TransactionReducer";
import { useUser } from "../UserContext/UserContext";
import { UserContextStateConnected } from "../UserContext/types";
import { TransactionState, TransactionType } from "./types";

export const TransactionContext = createContext<
  | undefined
  | {
      state: TransactionState;
      newTransaction: (type: TransactionType, value: string) => void;
      dispatch: (action: TransactionEvent) => void;
    }
>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  if (user.status !== "connected") return children;
  return (
    <TransactionProviderWithUser user={user}>
      {children}
    </TransactionProviderWithUser>
  );
}

function TransactionProviderWithUser({
  children,
  user,
}: {
  children: ReactNode;
  user: UserContextStateConnected;
}) {
  const [state, dispatch] = useReducer(transactionReducer, { status: null });
  const [dialog, setDialog] = useState(false);

  function newTransaction(type: TransactionType, value: string) {
    dispatch({ type: "idle", payload: { type, value } });
    setDialog(true);
  }

  return (
    <TransactionContext.Provider
      value={{ state, newTransaction, dispatch }}
    >
      {state.status !== null && (
        <DialogPrimitive.Root
          open={dialog}
          onOpenChange={() => { setDialog(false); }}
        >
          <DialogPrimitive.Portal forceMount>
            <AnimatePresence mode="wait">
              {dialog && (
                <>
                  <DialogOverlay />
                  <DialogContent title={state.type}>
                    <TransactionDialog state={state} />
                  </DialogContent>
                </>
              )}
            </AnimatePresence>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context)
    throw new Error(
      "useTransaction can only be called within a TransactionProvider",
    );
  return context;
}

export type TransactionEvent =
  | {
      type: "idle";
      payload: {
        type: TransactionType;
        value: string;
      };
    }
  | {
      type: "pending";
    }
  | {
      type: "success";
    }
  | {
      type: "error";
    };
