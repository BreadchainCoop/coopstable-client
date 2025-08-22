import { useEffect, useState } from "react";
import { useSwap } from "./SwapContext";
import { useMintCUSD, useBurnCUSD } from "@/app/context/ContractContext/hooks";
import { useAddTrustlines, useUserBalance, useAccount  } from "@/app/context/AccountContext";
import { Button } from "../Button";
import { useTransaction } from "@/app/context/TransactionContext/TransactionContext"; 
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { SWAP_MODES, TOKEN_CODES } from "@/app/constants";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { Asset } from "@stellar/stellar-sdk";

export function InitTransaction({ user, signTransaction }: { readonly user: UserContextStateConnected, readonly signTransaction: SignTransaction }) {
  const { state: swapState } = useSwap();
  const { 
    newTransaction, 
    dispatch, 
    state: transactionState, 
    existingTransaction, 
    dialog, 
    setDialog,
    clearTransactionState, 
    setTxLink,
  } = useTransaction();
  const token = swapState.mode === SWAP_MODES.MINT ? TOKEN_CODES.USDC : TOKEN_CODES.CUSD;
  const balances = useAccount(user.account, user.network);
  const userBalance = useUserBalance(user.account, user.network, token);
  const [assetsRequiringTrustline, setAssetsRequiringTrustline] = useState<Asset[]>([]);
  const { mutateAsync: addTrustlines, isPending: isPendingAddTrustlines } = useAddTrustlines();
  const { mutateAsync: mintCUSD, status: mintStatus, reset: resetMint } = useMintCUSD(setTxLink);
  const { mutateAsync: burnCUSD, status: burnStatus, reset: resetBurn } = useBurnCUSD(setTxLink);
  let reset = resetMint;
  let status = mintStatus;
  if (swapState.mode === SWAP_MODES.BURN) {
    reset = resetBurn;
    status = burnStatus;
  }

useEffect(() => {
  if (balances.status === "success") {
    setAssetsRequiringTrustline(Object.keys(balances.data.balances).map((key) => {
      const balanceValueObject = balances.data.balances[key as keyof typeof balances.data.balances];
      if (balanceValueObject?.requiresTrustline) return balanceValueObject.asset;
    }).filter((asset) => asset !== undefined))
  }
  
  if (status === "idle") return;
  if (status === "success" && !dialog) setDialog(true);
  dispatch({ type: status });
  
  return () => {
    if (status !== "pending") {
      clearTransactionState() 
      reset();
    } 
  };
}, [mintStatus, burnStatus, swapState.mode, dispatch, balances.status, balances.data]);

  const handleMint = async () => {
    if (userBalance.status !== "success") return;  
    await mintCUSD(parseFloat(swapState.inputValue));
  };

  const handleBurn = async () => {
    if (userBalance.status !== "success") return;
    await burnCUSD(parseFloat(swapState.inputValue));
  };

  const handleAddTrustlines = async (assets: Asset[]) => {  
    await addTrustlines({
      walletAddress: user.account,
      network: user.network,
      assets,
      inclusionFee: {
        type: 'Medium',
        fee: '1200',
      },
      signTransaction: signTransaction
    });
  };

  if (assetsRequiringTrustline.length > 0) {
    return (
      <Button size="large" fullWidth disabled={isPendingAddTrustlines} isLoading={isPendingAddTrustlines} onClick={async (e) => {
        e.preventDefault();
        await handleAddTrustlines(assetsRequiringTrustline);
      }}>
        Add Trustline
      </Button>
  );
  }

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
        if (transactionState.status !== null) { 
          existingTransaction(status, swapState.mode, swapState.inputValue);
          return;
        }
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
