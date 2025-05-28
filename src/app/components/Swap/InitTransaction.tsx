import { useSwap } from "./SwapContext";
import { Button } from "../Button";
import { useTransaction } from "@/app/context/TransactionContext/TransactionContext";
import { useNativeBalance } from "@/app/context/AccountContext";
import { UserContextStateConnected } from "@/app/context/UserContext/types";

/*

Clicking button launches wallet to sign tx and opens dialog 

*/

export function InitTransaction({ user }: { user: UserContextStateConnected }) {
  const { state: swapState } = useSwap();
  const { newTransaction } = useTransaction();

  const nativeBalance = useNativeBalance(user);

  if (swapState.inputValue === "") {
    return (
      <Button size="large" fullWidth disabled>
        Enter Amount
      </Button>
    );
  }
  return (
    <Button
      fullWidth
      size="large"
      onClick={() => {
        newTransaction(swapState.mode, swapState.inputValue);
      }}
    >
      {swapState.mode === "mint" ? "Mint" : "Burn"}
    </Button>
  );
}
