// import { TransactionDialog } from "@/app/components/Dialog/Dialog";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
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
import { useAllowance } from "../ContractContext/hooks";

export const TransactionContext = createContext<
  | undefined
  | {
      state: TransactionState;
      newTransaction: (type: TransactionType, value: string) => void;
      sendTransaction: (
        user: UserContextStateConnected,
        value: bigint,
      ) => Promise<void> | undefined;
    }
>(undefined);

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

  // const { signTransaction } = useUser();
  const { status: allowanceStatus, data: allowanceData } = useAllowance(
    user.account,
    user.network,
  );
  // const { signAndSend } = useTokenMint(signTransaction);
  console.log({ allowanceStatus, allowanceData });

  const sendTransaction = useCallback(
    async () => {
      // if (state.status === "init") {
      //   console.log("we sign and we send...");
      //   dispatch({ type: "submitted" });
      //   await signAndSend(user, BigInt(state.value));
      //   dispatch({ type: "success_result" });
      // }
    },
    [
      // signAndSend, user, state
    ],
  );

  // useEffect(() => {
  //   sendTransaction();
  // }, [sendTransaction]);

  function newTransaction(type: TransactionType, value: string) {
    dispatch({ type: "new", payload: { type, value } });
    setDialog(true);
  }

  return (
    <TransactionContext.Provider
      value={{ state, newTransaction, sendTransaction }}
    >
      {state.status !== null && (
        <DialogPrimitive.Root
          open={dialog}
          onOpenChange={() => {
            setDialog(false);
          }}
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
      type: "new";
      payload: {
        type: TransactionType;
        value: string;
      };
    }
  | {
      type: "submitted";
    }
  | {
      type: "success_result";
    }
  | {
      type: "error_result";
    };
