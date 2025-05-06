import Image from "next/image";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress } from "@/app/utils";

export function AccountConnected({
  user,
}: {
  user: UserContextStateConnected;
  disconnect: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 border-1 border-[#B1AEAB] bg-white p-2">
        <Image src="avatar.jpg" alt="user avatar" width={32} height={32} />
        <span className="font-theme-3 tracking-wide text-black">
          {truncateAddress(user.account)}
        </span>
      </div>
    </div>
  );
}
