import { sanitizeInputValue } from "@/app/utils";
import { createContext, ReactNode, useContext, useState } from "react";
import { SWAP_MODES } from "@/app/constants";

export type SwapMode = typeof SWAP_MODES[keyof typeof SWAP_MODES];

export type SwapState = {
  mode: SwapMode;
  inputValue: string;
};

export const SwapContext = createContext<
  | {
      state: SwapState;
      inputValueChange: (value: string) => void;
      modeChange: (mode: SwapMode) => void;
    }
  | undefined
>(undefined);

export function SwapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SwapState>({
    mode: SWAP_MODES.MINT,
    inputValue: "",
  });

  function inputValueChange(value: string) {
    setState((state) => ({
      ...state,
      inputValue: sanitizeInputValue(value),
    }));
  }

  function modeChange(mode: SwapMode) {
    setState((state) => ({
      ...state,
      mode,
    }));
  }

  return (
    <SwapContext.Provider value={{ state, inputValueChange, modeChange }}>
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const context = useContext(SwapContext);
  if (!context)
    throw new Error("useSwap can only be called within a SwapProvider");
  return context;
}
