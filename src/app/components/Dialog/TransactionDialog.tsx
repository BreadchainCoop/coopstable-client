import { ReactNode } from "react";
import {
  DialogDescription,
  Close as DialogPrimitiveClose,
} from "@radix-ui/react-dialog";

import { Spinner } from "../Spinner";
import { SWAP_MODES } from "@/app/constants";
import { SwapMode } from "../Swap/SwapContext";
import {
  TransactionState,
  TransactionStateError,
  TransactionStateInit,
  TransactionStateLoading,
  TransactionStateSuccess,
} from "@/app/context/TransactionContext/types";

import { CUSDIcon, SuccessIcon, USDCIcon, ErrorIcon, ExternalLinkIcon } from "../Icons";
import { DialogTitle } from "./Dialog";
import { Button } from "../Button";
import Link from "next/link";

export function TransactionDialog({
  state,
  explorerLink,
}: {
  explorerLink: string | undefined;
  state:
    | TransactionStateInit
    | TransactionStateLoading
    | TransactionStateSuccess
    | TransactionStateError;
}) {
  return (
    <div className="grid gap-8 py-4">
      <DialogTitle>
        {state.type === SWAP_MODES.MINT ? "Mint status" : "Burn status"}
      </DialogTitle>

      <TransactionStatus state={state} />
      {state.status !== "error" && (
        <>
          <TransactionSummary mode={state.type} txValue={state.value} />
          { explorerLink && <ExplorerLink link={explorerLink} />}
        </>
      )}
      <DialogPrimitiveClose asChild>
        <Button variant="secondary" size="large">
          Close
        </Button>
      </DialogPrimitiveClose>
    </div>
  );
}

export function TransactionStatus({ state }: { state: TransactionState }) {
  switch (state.status) {
    case "idle":
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="size-8">
            <Spinner />
          </div>
          <DialogDescription>in Progress</DialogDescription>
        </div>
      );
    case "pending":
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="size-8">
            <Spinner />
          </div>
          <DialogDescription>in Progress</DialogDescription>
        </div>
      );
    case "success":
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="size-10">
            <SuccessIcon />
          </div>
          <DialogDescription>
            {state.type === SWAP_MODES.MINT ? "Mint" : "Burn"} success!
          </DialogDescription>
        </div>
      );
    case "error":
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-10">
            <ErrorIcon />
          </div>
          <DialogDescription>
            Something went wrong. Please try again.
          </DialogDescription>
        </div>
      );
    default:
      throw new Error("invalid transacton status");
  }
}

export function TransactionSummary({
  mode,
  txValue,
}: {
  mode: SwapMode;
  txValue: string;
}) {
  return (
    <div className="border-theme-stone flex flex-col items-center gap-6 border p-6 sm:flex-row">
      <div className="flex grow justify-center">
        {mode === SWAP_MODES.MINT ? (
          <USDCLabel>{txValue}</USDCLabel>
        ) : (
          <CUSDLabel>{txValue}</CUSDLabel>
        )}
      </div>
      <div className="sm:-rotate-90 sm:transform">
        <DirectionArrow />
      </div>
      <div className="flex grow justify-center">
        {mode === SWAP_MODES.MINT ? (
          <CUSDLabel>{txValue}</CUSDLabel>
        ) : (
          <USDCLabel>{txValue}</USDCLabel>
        )}
      </div>
    </div>
  );
}

function CUSDLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <div className="size-6">
        <CUSDIcon />
      </div>
      <span className="font-bold text-[#333]">{children}</span>
      cUSD
    </div>
  );
}

function USDCLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <div className="size-6">
        <USDCIcon />
      </div>
      <span className="font-bold text-[#333]">{children}</span>
      USDC
    </div>
  );
}

function DirectionArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.75V20.25"
        stroke="#A49E86"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 13.5L12 20.25L5.25 13.5"
        stroke="#A49E86"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExplorerLink({ link }: { link: string }) {
  return (
    <Link
      href={link}
      className="text-theme-black item-center flex justify-center gap-1"
      target="_blank"
    >
      <span className="font-bold">View on explorer</span>
      <div className="size-6">
        <ExternalLinkIcon />
      </div>
    </Link>
  );
}
