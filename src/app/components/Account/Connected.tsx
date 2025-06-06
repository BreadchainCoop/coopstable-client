import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/app/components/Button";
import Image from "next/image";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress, formatBalance } from "@/app/utils";
import { TOKEN_CODES } from "@/app/constants";
import { useNativeBalance, useUserBalance } from "@/app/context/AccountContext";

export function AccountConnected({
  user,
  disconnectWallet,
}: {
  user: UserContextStateConnected;
  disconnectWallet: () => void;
}) {

  return (
    <>
      <div className="md:hidden">
        <AccountDropDown disconnect={disconnectWallet} user={user} />
      </div>
      <div className="hidden md:block">
        <AccountButton disconnectWallet={disconnectWallet} user={user} />
      </div>
    </>
  );
}

function AccountButton({
  disconnectWallet,
  user,
}: { 
    disconnectWallet: () => void, 
    user: UserContextStateConnected 
  }) {
  return <button onClick={(e) =>{
      e.preventDefault();
      disconnectWallet();
    }} className="cursor-pointer flex items-center gap-2 border-1 border-[#B1AEAB] bg-white p-2">
    <Image src="/avatar.jpg" alt="user avatar" width={32} height={32} />
    <span className="font-theme-3 tracking-wide text-black">
      {truncateAddress(user.account)}
    </span>
  </button>
}

function AccountForDropDown({
  user,
  isOpen,
}: { 
    user: UserContextStateConnected
    isOpen: boolean
  }) {
  return <div className={`cursor-pointer flex items-center gap-2 border-1 border-[#B1AEAB] bg-white p-2 ${isOpen ? "hidden" : ""}`}>
    <Image src="/avatar.jpg" alt="user avatar" width={32} height={32} />
    <span className="font-theme-3 tracking-wide text-black">
      {truncateAddress(user.account)}
    </span>
  </div>
}

export function AccountDropDown({
  disconnect,
  user,
}: {
  user: UserContextStateConnected;
  disconnect: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const xlmBalance = useNativeBalance(user.account, user.network);
  const cusdBalance = useUserBalance(user.account, user.network, TOKEN_CODES.CUSD);
  const usdcBalance = useUserBalance(user.account, user.network, TOKEN_CODES.USDC);
  console.log(xlmBalance);
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <AccountForDropDown user={user} isOpen={isOpen} />
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[100vw] bg-[#F7F6F3] shadow-lg z-40 p-6 tranform translate-y-[-54px]"
          side="bottom"
          align="end"
        >
          <div className="flex justify-end items-center mb-6">
            <DropdownMenu.Item asChild>
              <button className="p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownMenu.Item>
          </div>

          <div className="mb-8">
            <h2 className="text-black font-bold text-xl mb-4">Account</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#7A7A7A] text-sm">Address</span>
              <div className="flex items-center gap-2">
                <span className="text-black font-medium">
                  {truncateAddress(user.account)}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(user.account)}
                  className="p-1 hover:bg-gray-200 cursor-pointer"
                  title="Copy address"
                >
                  <svg width="18" height="18" viewBox="0 0 15 15" fill="#7A7A7A" xmlns="http://www.w3.org/2000/svg"><path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#7A7A7A] text-sm">XLM balance</span>
              <span className="text-black font-medium">
                {xlmBalance.status === "success" 
                  ? formatBalance(xlmBalance.data as string, "XLM").withSymbol
                  : "Loading..."
                }
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#7A7A7A] text-sm">USDC balance</span>
              <span className="text-black font-medium">
                {usdcBalance.status === "success" 
                  ? formatBalance(usdcBalance.data as string || "0", "USDC").withSymbol
                  : "0 USDC"
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7A7A7A] text-sm">cUSD generated</span>
              <span className="text-black font-medium">
                {cusdBalance.status === "success" 
                  ? formatBalance(cusdBalance.data as string || "0", "cUSD").withSymbol
                  : "0 cUSD"
                }
              </span>
            </div>
          </div>
          <nav className="space-y-4 mb-8">
            <DropdownMenu.Item asChild>
              <a 
                href="#mint" 
                className="block text-black font-bold text-xl hover:text-[#7A7A7A] transition-colors"
              >
                MINT
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a 
                href="#yield" 
                className="block text-[#7A7A7A] font-medium text-lg hover:text-black transition-colors"
              >
                YIELD DISTRIBUTION
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a 
                href="#submit" 
                className="flex items-center gap-2 text-[#7A7A7A] font-medium text-lg hover:text-black transition-colors"
              >
                SUBMIT PROJECT
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </DropdownMenu.Item>
          </nav>

          <DropdownMenu.Item asChild>
            <Button
              onClick={disconnect}
              fullWidth
              className="w-full block text-[#F2F1EE] bg-[#D9031B] px-4"
            >
              DISCONNECT
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
