import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogContent, DialogOverlay } from "@/app/components/Dialog/Dialog";
import { TransactionDialog } from "@/app/components/Dialog/TransactionDialog";
import { transactionReducer } from "./TransactionReducer";
import { useUser } from "../UserContext/UserContext";
import { UserContextStateConnected } from "../UserContext/types";
import { TransactionState, TransactionStatus, TransactionType } from "./types";
import { getNetworkConfig } from "@/app/config";

export const TransactionContext = createContext<
  | undefined
  | {
      state: TransactionState;
      newTransaction: (type: TransactionType, value: string) => void;
      setTxLink: (txHash: string | undefined) => void;
      existingTransaction: (status: TransactionStatus, type: TransactionType, value: string) => void;
      clearTransactionState: () => void;
      dispatch: (action: TransactionEvent) => void;
      dialog: boolean;
      setDialog: (value: boolean) => void;
    }
>(undefined);

export function TransactionProvider({children}: { readonly children: ReactNode }) {
  const {user} = useUser();
  if (user.status !== "connected") return children;
  
  return <TransactionProviderWithUser user={user}>{children}</TransactionProviderWithUser>;
}

function TransactionProviderWithUser({
  children,
  user,
}: {
  readonly children: ReactNode;
  readonly user: UserContextStateConnected;
}) {
  const config = getNetworkConfig(user.network);
  const [state, dispatch] = useReducer(transactionReducer, { status: null });
  const [dialog, setDialog] = useState(false);
  const [explorerLink, setExplorerLink] = useState<string | undefined>(undefined); 

  const newTransaction = useCallback((type: TransactionType, value: string) => {
    setExplorerLink(undefined);
    dispatch({ type: "idle", payload: { type, value } });
    setDialog(true);
  }, []);

  const existingTransaction = useCallback((status: TransactionStatus, type: TransactionType, value: string) => {
    dispatch({ type: status, payload: { type, value } });
    setDialog(true);
  }, []);

  const clearTransactionState = useCallback(() => {
    dispatch({ type: "reset" });
    setDialog(false);
    setExplorerLink(undefined);
  }, []);

  const setTxLink = useCallback((txHash: string | undefined) => {
    if (txHash === undefined) return;
    setExplorerLink(`${config.explorerUrl}/tx/${txHash}`);
  }, [config.explorerUrl]);

  const contextValue = useMemo(() => ({
    state,
    newTransaction,
    dispatch,
    existingTransaction,
    dialog,
    setDialog,
    clearTransactionState,
    setTxLink,
  }), [state, newTransaction, existingTransaction, dialog, clearTransactionState, setTxLink]);
  return (
    <TransactionContext.Provider
      value={contextValue}
    >
      {dialog && state.status !== null && (
        <DialogPrimitive.Root open onOpenChange={(open) => {
            if (!open && (state.status === "success" || state.status === "error")) {
              clearTransactionState();
            }
          }} >
          <DialogPrimitive.Portal>
            <DialogOverlay />
            <DialogContent title={state.type}>
              <TransactionDialog state={state} explorerLink={explorerLink} onClose={clearTransactionState} />
            </DialogContent>
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
      errorMessage?: string;
    }
  | {
      type: "reset";
    };
