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
// import { useAllowance } from "../ContractContext/hooks";
import { useCUSDBalance, useSequenceNumber } from "../AccountContext";
import { TransactionState, TransactionType } from "./types";
import { useTokenMint } from "../ContractContext/hooks";

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

  // const cusdBalance = useCUSDBalance(user.account, user.network);

  const { signTransaction } = useUser();
  // const allowance = useAllowance(user.account, user.network);
  const sequenceNumber = useSequenceNumber(user.account, user.network);

  // useEffect(() => {
  //   console.log("sequenceNumber: ", sequenceNumber);
  //   console.log("cusdBalance: ", cusdBalance);
  // }, [sequenceNumber, cusdBalance]);

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

  const {
    state: { status },
    signAndSend,
  } = useTokenMint(signTransaction);

  useEffect(() => {
    if (status === "init" && sequenceNumber.data !== null) {
      signAndSend(user, sequenceNumber.data, BigInt(5));
    }
  }, [user, sequenceNumber, status, signAndSend]);

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
