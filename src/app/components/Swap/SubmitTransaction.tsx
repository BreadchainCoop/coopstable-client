import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { Dialog } from "../Dialog/Dialog";
import { useSwap } from "./SwapContext";
import { Button } from "../Button";

/*

Clicking button launches wallet to sign tx and opens dialog 


*/

export function SubmitTransaction({
  user,
}: {
  user: UserContextStateConnected;
}) {
  const { state: swapState } = useSwap();
  console.log(user);
  return <Dialog mode={swapState.mode} txValue={swapState.inputValue} />;
  if (swapState.mode === "mint") {
    return (
      <Button fullWidth size="large">
        Mint
      </Button>
    );
  } else {
    return (
      <Button fullWidth size="large">
        Burn
      </Button>
    );
  }
}
