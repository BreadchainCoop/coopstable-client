import { useRef } from "react";
import Link from "next/link";

import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { AccountDropDownMobile } from "./AccountDropDownMobile";
import { AccountDropDown } from "./AccountDropDown";

export function AccountConnected({
  user,
  disconnectWallet,
}: Readonly<{
  user: UserContextStateConnected;
  disconnectWallet: () => void;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="md:hidden">
        <AccountDropDownMobile disconnect={disconnectWallet} user={user} />
      </div>
      <div className="hidden md:flex items-center gap-2 justify-between" ref={containerRef}>
          <Link 
            target="_blank" 
            href="https://form.typeform.com/to/sHp99h2H" 
            className="font-theme-2 px-6 py-3 text-[20px] lg:text-xl text-theme-black bg-theme-grey-3 font-bold uppercase hover:cursor-pointer"
          >Submit Project</Link> 
        <AccountDropDown disconnect={disconnectWallet} user={user} containerRef={containerRef} />
      </div>
    </>
  );
}