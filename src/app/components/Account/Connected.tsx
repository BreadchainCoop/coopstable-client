import Image from "next/image";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress } from "@/app/utils";
import { useNativeBalance } from "@/app/context/AccountContext";

export function AccountConnected({
  user,
  disconnectWallet,
}: {
  user: UserContextStateConnected;
  disconnectWallet: () => void;
}) {
  const { status, data } = useNativeBalance(user);

  return (
    <div>
      <div className="flex items-center gap-2 border-1 border-[#B1AEAB] bg-white p-2">
        <Image src="/avatar.jpg" alt="user avatar" width={32} height={32} />
        <span className="font-theme-3 tracking-wide text-black">
          {truncateAddress(user.account)}
        </span>
        <button onClick={() => disconnectWallet()}>disconnect</button>
        {status === "success" && data}
      </div>
    </div>
  );
}
