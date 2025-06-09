import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/app/components/Button";


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
          <button 
            className="flex flex-col gap-1.5 p-2 focus:outline-none lg:hidden"
            aria-label="Toggle menu"
          >
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
          className="w-[100vw] bg-[#F7F6F3] shadow-lg z-40 p-6"
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
              <a href="#mint" className="block text-black font-bold text-xl hover:text-[#7A7A7A] transition-colors">
                MINT
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a href="#yield" className="block text-[#7A7A7A] font-medium text-lg hover:text-black transition-colors">
                YIELD DISTRIBUTION
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a href="#submit" className="flex items-center gap-2 text-[#7A7A7A] font-medium text-lg hover:text-black transition-colors">
                SUBMIT PROJECT
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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