"use client";
import * as React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { HoverCard } from "radix-ui";


export function DistributionInfoCircleWithPopOver() {
  
  return (
    <HoverCard.Root openDelay={100}>
      <HoverCard.Trigger asChild>
        <a href="#" className="size-6">
          <InfoCircledIcon width="100%" height="100%" />
        </a>
      </HoverCard.Trigger>
    <HoverCard.Content sideOffset={5} className="flex justify-center w-dvw p-[1rem]">
        <div className="bg-theme-grey-1 border-theme-grey-7 border-1 border-opacity-50 w-full p-8 space-y-6"> 
          <div className="flex flex-col gap-2 text-left">
            <h2 className="text-black text-[24px]">Yield breakdown</h2>
            <p className="text-black opacity-50 text-[16px] wrap-break-word">
              In every round, before CoopStable yield goes to projects, 
              10% is set aside for the core team—recognizing the work that keeps the system running.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between">
              <span className="text-black opacity-50 text-[16px]">Core team 10%</span>
              <span className="font-bold text-[16px] text-black">2,000 cUSD</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="text-black opacity-50 text-[16px]">Cohort 90%</span>
              <span className="font-bold text-[16px] text-black">18,000 cUSD</span>
            </div>
          </div>
        </div>
      <HoverCard.Arrow className="HoverCardArrow" />
    </HoverCard.Content>
	</HoverCard.Root>
  );
};


