import Image from "next/image"
import { UserContextStateConnected } from "@/app/context/UserContext/types"
import { truncateAddress } from "@/app/utils"

export function AccountForDropDown({
  user,
  isOpen,
}: Readonly<{ 
    user: UserContextStateConnected
    isOpen: boolean
  }>) {
  return <div className={`cursor-pointer flex items-center gap-2 border-[1px] border-theme-grey-4 bg-white p-[9px] ${isOpen ? "hidden" : ""}`}>
    <Image src="/avatar.jpg" alt="user avatar" width={32} height={32} />
    <span className="text-[16px] leading-[1.2] font-theme-3 tracking-wide text-black">
      {truncateAddress(user.account)}
    </span>
  </div>
}