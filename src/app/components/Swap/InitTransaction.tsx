import { useEffect, useMemo } from "react";
import { useSwap } from "./SwapContext";
import { useMintCUSD, useBurnCUSD } from "@/app/context/ContractContext/hooks";
import { useAddTrustlines, useUserBalance, useAccount  } from "@/app/context/AccountContext";
import { Button } from "../Button";
import { useTransaction } from "@/app/context/TransactionContext/TransactionContext";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { SWAP_MODES, TOKEN_CODES } from "@/app/constants";
import { SignTransaction } from "@stellar/stellar-sdk/contract";
import { Asset } from "@stellar/stellar-sdk";
import { parseContractError } from "@/app/utils/contractError";

export function InitTransaction({ user, signTransaction }: { readonly user: UserContextStateConnected, readonly signTransaction: SignTransaction }) {
  const { state: swapState } = useSwap();
  const {
    newTransaction,
    dispatch,
    state: transactionState,
    existingTransaction,
    setTxLink,
  } = useTransaction();
  const token = swapState.mode === SWAP_MODES.MINT ? TOKEN_CODES.USDC : TOKEN_CODES.CUSD;
  const balances = useAccount(user.account, user.network);
  const userBalance = useUserBalance(user.account, user.network, token);
  const assetsRequiringTrustline = useMemo(() => {
    if (balances.status !== "success") return [];
    return Object.keys(balances.data.balances)
      .map((key) => {
        const balanceValueObject = balances.data.balances[key as keyof typeof balances.data.balances];
        if (balanceValueObject?.requiresTrustline) return balanceValueObject.asset;
      })
      .filter((asset): asset is Asset => asset !== undefined);
  }, [balances]);
  const { mutateAsync: addTrustlines, isPending: isPendingAddTrustlines } = useAddTrustlines();
  const { mutateAsync: mintCUSD, status: mintStatus, error: mintError, reset: resetMint } = useMintCUSD(setTxLink);
  const { mutateAsync: burnCUSD, status: burnStatus, error: burnError, reset: resetBurn } = useBurnCUSD(setTxLink);
  const status = swapState.mode === SWAP_MODES.BURN ? burnStatus : mintStatus;
  const error = swapState.mode === SWAP_MODES.BURN ? burnError : mintError;

  // Sync mutation status to transaction state
  useEffect(() => {
    if (status === "idle") return;
    if (status === "error") {
      dispatch({ type: "error", errorMessage: parseContractError(error) });
    } else {
      dispatch({ type: status });
    }
  }, [status, error, dispatch]);

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
        // Reset previous mutation state before starting new transaction
        resetMint();
        resetBurn();
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
