"use client";
import Link from "next/link";
import { cn, pageWrapClasses } from "../utils";
import { Account } from "./Account/Account";

export function Header() {
  return (
    <header data-testid="header">
      <div className={cn(pageWrapClasses, "pt-5 lg:pt-10 flex items-center")}>
        <div className="flex items-center gap-8">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="size-8">
              <Logo />
            </div>
            <span className="font-theme-2 translate-y-0.5 transform text-3xl leading-none font-extrabold tracking-wider text-black sm:block">
              CoopStable
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden lg:block space-x-3">
            <Link 
              href="/#mint" 
              className="px-[12px] py-[10px] text-black font-theme-2 text-[20px] font-bold"
            >
              Mint
            </Link>
            <Link 
              href="/yield-distribution" 
              className="px-[12px] py-[10px] text-black font-theme-2 text-[20px] font-bold"
            >
              Yield distribution
            </Link>
          </div>
        </div>
        
        <div className="grow"></div>
        <Account />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      className="size-full"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 40H0V0H40V40ZM20 8.75C13.7868 8.75 8.75 13.7868 8.75 20C8.75 26.2132 13.7868 31.25 20 31.25C26.2132 31.25 31.25 26.2132 31.25 20C31.25 13.7868 26.2132 8.75 20 8.75Z"
        fill="url(#paint0_linear_323_68)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_323_68"
          x1="32.5"
          y1="20"
          x2="7.5"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#666462" />
          <stop offset="1" stopColor="#11110F" />
        </linearGradient>
      </defs>
    </svg>
  );
}