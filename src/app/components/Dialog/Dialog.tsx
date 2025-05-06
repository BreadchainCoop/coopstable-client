import { Button } from "../Button";
import { Spinner } from "../Spinner";
import { SwapMode } from "../Swap/SwapContext";
import {
  Dialog as RadixDialog,
  DialogContent as RadixDialogContent,
  DialogHeader as RadixDialogHeader,
  DialogTitle as RadixDialogTitle,
  DialogTrigger as RadixDialogTrigger,
} from "./ui";
import { ReactNode } from "react";

export function Dialog({ mode, txValue }: { mode: SwapMode; txValue: string }) {
  return (
    <RadixDialog>
      <RadixDialogTrigger asChild>
        <Button fullWidth size="large">
          {mode === "burn" ? "Burn" : "Mint"}
        </Button>
      </RadixDialogTrigger>
      <RadixDialogContent className="sm:max-w-[425px]">
        <RadixDialogHeader>
          <RadixDialogTitle>
            {mode === "burn" ? "Burn" : "Mint"} status
          </RadixDialogTitle>
        </RadixDialogHeader>
        <div className="grid gap-4 py-4">
          <TransactionStatus />
          <TransactionSummary mode={mode} txValue={txValue} />
        </div>
      </RadixDialogContent>
    </RadixDialog>
  );
}

function TransactionStatus() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="size-8">
        <Spinner />
      </div>
      <span>in Progress</span>
    </div>
  );
}

function TransactionSummary({
  mode,
  txValue,
}: {
  mode: SwapMode;
  txValue: string;
}) {
  return (
    <div className="flex">
      <div className="flex grow justify-center">
        {mode === "mint" ? (
          <USDCLabel>{txValue}</USDCLabel>
        ) : (
          <CUSDLabel>{txValue}</CUSDLabel>
        )}
      </div>
      <div>{"->"}</div>
      <div className="flex grow justify-center">
        {txValue}
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
    <div className="flex gap-1">
      <span>{children}</span>
      cUSD
    </div>
  );
}

function USDCLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-1">
      <span>{children}</span>
      USDC
    </div>
  );
}
