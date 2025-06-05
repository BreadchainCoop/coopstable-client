import { useEffect } from "react";
import { useSwap } from "./SwapContext";
import { useMintCUSD, useBurnCUSD } from "@/app/context/ContractContext/hooks";
import { useUserBalance } from "@/app/context/AccountContext";
import { Button } from "../Button";
import { TransactionEvent, useTransaction } from "@/app/context/TransactionContext/TransactionContext"; 
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { SWAP_MODES, TOKEN_CODES } from "@/app/constants";

export function InitTransaction({ user }: { user: UserContextStateConnected }) {
  const { state: swapState } = useSwap();
  const { newTransaction, dispatch } = useTransaction();
  const token = swapState.mode === SWAP_MODES.MINT ? TOKEN_CODES.USDC : TOKEN_CODES.CUSD;
  const userBalance = useUserBalance(user.account, user.network, swapState.mode === SWAP_MODES.MINT ? TOKEN_CODES.USDC : TOKEN_CODES.CUSD); 
  const { mutateAsync: mintCUSD, data: mintData, status: mintStatus } = useMintCUSD();
  const { mutateAsync: burnCUSD, data: burnData, status: burnStatus } = useBurnCUSD();

  // Move useEffect to top, before any conditional returns
  useEffect(() => {
    
    let status = mintStatus;
    if (swapState.mode === SWAP_MODES.BURN) status = burnStatus;
    if (status === "idle") return;
    dispatch({ type: status });
    return () => {};
  }, [mintStatus, burnStatus, swapState.mode, dispatch]);

  const handleMint = async () => {
    if (userBalance.status !== "success") return;  
    await mintCUSD(parseFloat(swapState.inputValue));
  };

  const handleBurn = async () => {
    if (userBalance.status !== "success") return;
    await burnCUSD(parseFloat(swapState.inputValue));
  };

  // Conditional rendering after all hooks
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
      onClick={async (e) => {
        e.preventDefault();
        newTransaction(
          swapState.mode,
          swapState.inputValue
        );
        if (swapState.mode === SWAP_MODES.MINT) { 
          await handleMint();
        } else {
          await handleBurn();
        }
      }}
    >
      {swapState.mode === SWAP_MODES.MINT ? "Mint" : "Burn"}
    </Button>
  );
}