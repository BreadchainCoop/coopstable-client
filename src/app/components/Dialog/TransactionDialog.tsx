import { ReactNode } from "react";
import {
  DialogDescription,
  Close as DialogPrimitiveClose,
} from "@radix-ui/react-dialog";

import { Spinner } from "../Spinner";
import { SwapMode } from "../Swap/SwapContext";
import {
  TransactionState,
  TransactionStateError,
  TransactionStateInit,
  TransactionStateSubmitted,
  TransactionStateSuccess,
} from "@/app/context/TransactionContext/TransactionContext";
import { CUSDIcon, SuccessIcon, USDCIcon, ErrorIcon } from "../Icons";
import { DialogTitle } from "./Dialog";
import { Button } from "../Button";
import Link from "next/link";

export function TransactionDialog({
  state,
}: {
  state:
    | TransactionStateInit
    | TransactionStateSubmitted
    | TransactionStateSuccess
    | TransactionStateError;
}) {
  return (
    <div className="grid gap-8 py-4">
      <DialogTitle>
        {state.type === "mint" ? "Mint status" : "Burn status"}
      </DialogTitle>

      <TransactionStatus state={state} />
      {state.status !== "error" && (
        <>
          <TransactionSummary mode={state.type} txValue={state.value} />
          <ExplorerLink />
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
    case "init":
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="size-8">
            <Spinner />
          </div>
          <DialogDescription>in Progress</DialogDescription>
        </div>
      );
    case "submitted":
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
            {state.type === "mint" ? "Mint" : "Burn"} success!
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
        {mode === "mint" ? (
          <USDCLabel>{txValue}</USDCLabel>
        ) : (
          <CUSDLabel>{txValue}</CUSDLabel>
        )}
      </div>
      <div className="sm:-rotate-90 sm:transform">
        <DirectionArrow />
      </div>
      <div className="flex grow justify-center">
        {mode === "burn" ? (
          <USDCLabel>{txValue}</USDCLabel>
        ) : (
          <CUSDLabel>{txValue}</CUSDLabel>
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

function ExplorerLink() {
  return (
    <Link
      href={"#"}
      className="text-theme-black item-center flex justify-center gap-1"
    >
      <span className="font-bold">View on explorer</span>
      <div className="size-6">
        <svg
          className="size-full"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.75 9.75L20.7491 3.75094L14.75 3.75"
            stroke="#11110F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.25 11.25L20.75 3.75"
            stroke="#11110F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.75 12.75V19.5C17.75 19.6989 17.671 19.8897 17.5303 20.0303C17.3897 20.171 17.1989 20.25 17 20.25H5C4.80109 20.25 4.61032 20.171 4.46967 20.0303C4.32902 19.8897 4.25 19.6989 4.25 19.5V7.5C4.25 7.30109 4.32902 7.11032 4.46967 6.96967C4.61032 6.82902 4.80109 6.75 5 6.75H11.75"
            stroke="#11110F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
