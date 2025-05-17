"use client";
import { useUser } from "@/app/context/UserContext/UserContext";
import { SwapProvider, useSwap } from "./SwapContext";
// import { UserContextStateConnected } from "@/app/context/UserContext/types";
// import { useTokenABalance } from "@/app/context/ContractContext/hooks";
import { Button } from "../Button";
import { cn } from "@/app/utils";
import { ReactNode } from "react";
import { InitTransaction } from "./InitTransaction";
import { CUSDIcon, USDCIcon } from "../Icons";

export function Swap() {
  const { user, connectWallet } = useUser();

  return (
    <SwapProvider>
      <form
        className="w-full max-w-106 border-1 border-[#B1AEAB] bg-[#F7F6F3] p-4"
        onSubmit={(event) => event.preventDefault()}
        data-testid="swap"
      >
        <SwapFormHeader />
        <SwapFrom />
        <ModeReverse />
        <SwapTo />
        <div className="h-6"></div>
        {user.status === "loading" && (
          <Button size="large" fullWidth disabled>
            loading...
          </Button>
        )}
        {user.status === "not_connected" && (
          <Button onClick={connectWallet} size="large" fullWidth>
            Sign In
          </Button>
        )}
        {user.status === "connected" && <InitTransaction />}
      </form>
    </SwapProvider>
  );
}

function SwapFormHeader() {
  const { state, modeChange } = useSwap();
  return (
    <div className="flex justify-center pb-2">
      <button
        className={cn(
          "font-theme-2 text-theme-black px-2 pb-1 text-xl leading-none font-black opacity-50 hover:cursor-pointer",
          state.mode === "mint" && "opacity-100",
        )}
        onClick={() => modeChange("mint")}
        aria-label="mint mode"
      >
        Mint
      </button>
      <button
        className={cn(
          "font-theme-2 text-theme-black px-2 pb-1 text-xl leading-none font-black opacity-50 hover:cursor-pointer",
          state.mode === "burn" && "opacity-100",
        )}
        aria-label="burn mode"
        onClick={() => modeChange("burn")}
      >
        Burn
      </button>
    </div>
  );
}

function SwapFrom() {
  const { state, inputValueChange } = useSwap();
  const token = state.mode === "mint" ? "USDC" : "cUSD";

  return (
    <div className="border-theme-grey-4 flex flex-col gap-1 border-1 p-2">
      <label htmlFor="deposit-amount" className="text-theme-grey-5 p-1 text-xs">
        You deposit
      </label>
      <div className="flex gap-4">
        <div className="grow">
          <input
            className="w-full grow p-1 text-3xl text-black placeholder-black"
            placeholder="00.00"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minLength={1}
            maxLength={79}
            spellCheck="false"
            value={state.inputValue}
            onChange={(event) => {
              inputValueChange(event.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1">
          <div className="size-6">
            {state.mode === "mint" ? <USDCIcon /> : <CUSDIcon />}
          </div>
          <span className="text-theme-grey-6 text-xl">{token}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <BalanceDisplay>Balance: 0.00 {token}</BalanceDisplay>
      </div>
    </div>
  );
}

function BalanceDisplay({ children }: { children: ReactNode }) {
  return <span className="text-theme-grey-5 pt-1 text-xs">{children}</span>;
}

// function NativeBalanceDisplay({ user }: { user: UserContextStateConnected }) {
//   const { status, data } = useNativeBalance(user);

//   if (status === "success") return data;
//   return "";
// }

function SwapTo() {
  const { state } = useSwap();
  const token = state.mode === "burn" ? "USDC" : "cUSD";
  return (
    <div className="border-theme-grey-4 flex flex-col gap-1 border-1 p-2">
      <span className="text-theme-grey-5 p-1 text-xs">You receive</span>
      <div className="flex">
        <div className="grow truncate overflow-hidden p-1 text-3xl text-black">
          {state.inputValue === "" ? <span>00.00</span> : state.inputValue}
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1">
          <div className="size-6">
            {state.mode === "burn" ? <USDCIcon /> : <CUSDIcon />}
          </div>
          <span className="text-theme-grey-6 text-xl"> {token}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <BalanceDisplay>Balance: 0.00 {token}</BalanceDisplay>
      </div>
    </div>
  );
}

function ModeReverse() {
  const { state, modeChange } = useSwap();
  return (
    <div className="relative h-2">
      <button
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 transform border-[1.5px] border-[#B1AEAB] bg-white p-1 hover:cursor-pointer"
        onClick={() => {
          modeChange(state.mode === "burn" ? "mint" : "burn");
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.125V16.875"
            stroke="#11110F"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.375 11.25L10 16.875L15.625 11.25"
            stroke="#11110F"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
