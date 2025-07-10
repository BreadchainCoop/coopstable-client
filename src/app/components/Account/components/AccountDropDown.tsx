import Link from "next/link";
import { TOKEN_CODES } from "@/app/constants";
import { useNativeBalance, useUserBalance } from "@/app/context/AccountContext";
import { useGetTotalDistributed } from "@/app/context/ContractContext/hooks";
import { UserContextStateConnected } from "@/app/context/UserContext/types";
import { truncateAddress, formatBalance, formatXLMWithSymbol } from "@/app/utils";
import { CopyIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "radix-ui";
import { useState, useEffect } from "react";
import { Button } from "../../Button";
import { AccountForDropDown } from "./AccountForDropDown";

export function AccountDropDown({
    disconnect,
    user,
    containerRef,
  }: Readonly<{ 
      containerRef?: React.RefObject<HTMLDivElement | null>
      disconnect: () => void, 
      user: UserContextStateConnected 
  }>) {
    const [isOpen, setIsOpen] = useState(false);
    const [containerWidth, setContainerWidth] = useState<number | undefined>();
    
    const xlmBalance = useNativeBalance(user.account, user.network);
    const usdcBalance = useUserBalance(user.account, user.network, TOKEN_CODES.USDC);
    const { data: totalDistributed } = useGetTotalDistributed();
    
    useEffect(() => {
      if (isOpen && containerRef?.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, [isOpen, containerRef]);
    
    return (
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button>
            <AccountForDropDown user={user} isOpen={false} />
          </button>
        </DropdownMenu.Trigger>
        
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-theme-grey-1 shadow-lg z-40 p-6 font-theme-2"
            style={{ width: containerWidth ? `${containerWidth}px` : 'auto' }}
            side="bottom"
            align="end"
            sideOffset={5}
          >
            <div className="mb-8">
              <h2 className="text-black opacity-50 font-bold text-xl mb-4">Account</h2>
              <div className="flex justify-between items-center mb-2 text-[16px]">
                <span className="text-black opacity-50">Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-black font-semibold ">
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
              <div className="flex justify-between items-center mb-2 text-[16px]">
                <span className="text-black opacity-50">XLM balance</span>
                <span className="text-black font-semibold">
                  {xlmBalance.status === "success" 
                    ? formatBalance(xlmBalance.data as string, "XLM").withSymbol
                    : "Loading..."
                  }
                </span>
              </div>
              <div className="flex justify-between items-center mb-2 text-[16px]">
                <span className="text-black opacity-50">USDC balance</span>
                <span className="text-black font-semibold">
                  {usdcBalance.status === "success" 
                    ? formatBalance(usdcBalance.data?.balance as string || "0", "USDC").withSymbol
                    : "0 USDC"
                  }
                </span>
              </div>
              <div className="flex justify-between items-center text-[16px]">
                <span className="text-black opacity-50">cUSD generated</span>
                <span className="text-black font-semibold">
                  {formatXLMWithSymbol(totalDistributed ?? 0, {symbol: 'cUSD', decimals: 4}).withSymbol}
                </span>
              </div>
            </div>
            <nav className="space-y-4 mb-8 md:hidden">
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
                className="w-full block font-theme-3 font-semibold text-theme-grey-1 bg-theme-cta py-3"
              >
                DISCONNECT
              </Button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }