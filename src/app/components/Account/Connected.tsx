import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress, formatBalance, formatXLMWithSymbol } from "@/app/utils";
import { TOKEN_CODES } from "@/app/constants";
import { useNativeBalance, useUserBalance } from "@/app/context/AccountContext";
import { CopyIcon, ExternalLinkIcon } from "../Icons";
import Link from "next/link";
import { useGetTotalDistributed } from "@/app/context/ContractContext/hooks";

export function AccountConnected({
  user,
  disconnectWallet,
}: Readonly<{
  user: UserContextStateConnected;
  disconnectWallet: () => void;
}>) {

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
}: Readonly<{ 
    disconnectWallet: () => void, 
    user: UserContextStateConnected 
  }>) {

  return <button onClick={(e) => {
      e.preventDefault();
      disconnectWallet();
    }} className="cursor-pointer flex items-center gap-2 border-1 border-theme-grey-4 bg-white p-2">
    <Image src="/avatar.jpg" alt="user avatar" width={30} height={30} />
    <span className="px-8 py-3 text-[16px] lg:text-xl font-theme-3 tracking-wide text-black">
      {truncateAddress(user.account)}
    </span>
  </button>
}

function AccountForDropDown({
  user,
  isOpen,
}: Readonly<{ 
    user: UserContextStateConnected
    isOpen: boolean
  }>) {
  return <div className={`cursor-pointer flex items-center gap-2 border-1 border-theme-grey-4 bg-white p-2 ${isOpen ? "hidden" : ""}`}>
    <Image src="/avatar.jpg" alt="user avatar" width={32} height={32} />
    <span className="px-8 py-3 text-[16px] lg:text-xl font-theme-3 tracking-wide text-black">
      {truncateAddress(user.account)}
    </span>
  </div>
}

export function AccountDropDown({
  disconnect,
  user,
}: Readonly<{
  user: UserContextStateConnected;
  disconnect: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const xlmBalance = useNativeBalance(user.account, user.network);
  const usdcBalance = useUserBalance(user.account, user.network, TOKEN_CODES.USDC);
  const { data: totalDistributed } = useGetTotalDistributed();
  
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <AccountForDropDown user={user} isOpen={isOpen} />
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[100vw] bg-theme-grey-1 shadow-lg z-40 p-6 tranform translate-y-[-54px]"
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
            <h2 className="text-black opacity-50 font-bold text-xl mb-4">Account</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-black opacity-50 text-sm">Address</span>
              <div className="flex items-center gap-2">
                <span className="text-black font-medium">
                  {truncateAddress(user.account)}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(user.account)}
                  className="p-1 hover:bg-gray-200 cursor-pointer"
                  title="Copy address"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-black opacity-50 text-sm">XLM balance</span>
              <span className="text-black font-medium">
                {xlmBalance.status === "success" 
                  ? formatBalance(xlmBalance.data as string, "XLM").withSymbol
                  : "Loading..."
                }
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-black opacity-50 text-sm">USDC balance</span>
              <span className="text-black font-medium">
                {usdcBalance.status === "success" 
                  ? formatBalance(usdcBalance.data?.balance as string || "0", "USDC").withSymbol
                  : "0 USDC"
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black opacity-50 text-sm">cUSD generated</span>
              <span className="text-black font-medium">
                {formatXLMWithSymbol(totalDistributed ?? 0, {symbol: 'cUSD', decimals: 7}).withSymbol}
              </span>
            </div>
          </div>
          <nav className="space-y-4 mb-8">
            <DropdownMenu.Item asChild>
              <Link 
                href="/#mint" 
                className="block text-theme-black font-bold text-xl hover:text-[#7A7A7A] transition-colors"
              >
                MINT
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link href="/yield-distribution" className="block text-theme-black opacity-50 font-medium text-lg hover:text-black transition-colors">
                YIELD DISTRIBUTION
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link 
                href="https://form.typeform.com/to/sHp99h2H" 
                className="flex items-center gap-2 text-theme-black opacity-50 font-medium text-lg hover:text-black transition-colors"
                target="_blank"
              >
                <span>SUBMIT PROJECT</span>
                <div className="size-5"> 
                  <ExternalLinkIcon stroke="currentColor"/>
                </div>
              </Link>
            </DropdownMenu.Item>
          </nav>

          <DropdownMenu.Item asChild>
            <Button
              onClick={disconnect}
              fullWidth
              className="w-full block text-theme-grey-1 bg-theme-cta py-3"
            >
              DISCONNECT
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
