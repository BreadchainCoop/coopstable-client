import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { ExternalLinkIcon } from "../Icons";

export function HeaderBurgerMenu({
  connect,
}: {
  connect: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      {
        !isOpen && <DropdownMenu.Trigger asChild>
          <button className="flex flex-col gap-1.5 p-2 focus:outline-none lg:hidden" aria-label="Toggle menu">
            <div className={`h-0.5 w-8 bg-black transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}></div>
            <div className={`h-0.5 w-8 bg-black transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}></div>
            <div className={`h-0.5 w-8 bg-black transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}></div>
          </button>
        </DropdownMenu.Trigger>
      }

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[100vw] bg-theme-grey-1 shadow-lg z-40 p-6"
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

          <nav className="space-y-6">
            <DropdownMenu.Item asChild>
              <Link href="#mint" className="block text-theme-black font-medium text-lg hover:text-black transition-colors">MINT</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link href="/yield" className="block text-theme-black opacity-50 font-medium text-lg hover:text-black transition-colors">YIELD DISTRIBUTION</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link href="/#submit" className="flex items-center gap-3 text-theme-black opacity-50 font-medium text-lg hover:text-black transition-colors">
                <span>SUBMIT PROJECT</span>
                <div className="size-5">
                  <ExternalLinkIcon stroke="currentColor"/>
                </div>
              </Link>
            </DropdownMenu.Item>
          </nav>

          <DropdownMenu.Item className="mt-8 pt-6 z-40">
            <Button fullWidth onClick={connect}>
              SIGN IN
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}