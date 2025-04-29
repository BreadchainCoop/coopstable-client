import { useNativeBalance } from "@/app/context/BalanceContext";
import { useTokenABalance } from "@/app/context/ContractContext/hooks";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress } from "@/app/utils";

export function AccountConnected({
  user,
  disconnect,
}: {
  user: UserContextStateConnected;
  disconnect: () => void;
}) {
  const { status, data } = useNativeBalance(user);
  const { status: tokenStatus, data: tokenData } = useTokenABalance(user);

  return (
    <div>
      address: {truncateAddress(user.account)}
      <button onClick={disconnect}>disconnect</button>
      <div>
        <span>native balance 1234 :</span>
        <span>{status === "success" && data}</span>
      </div>
      <div>
        <span>token A balance:</span>
        <span>{tokenStatus === "success" && tokenData}</span>
      </div>
    </div>
  );
}
