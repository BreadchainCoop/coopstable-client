"use client";
import * as React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Popover, HoverCard } from "radix-ui";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";

export function DistributionInfoCircleWithPopOver() {
  
  return (
    <HoverCard.Root openDelay={0} defaultOpen={true}>
      <HoverCard.Trigger asChild>
        <a href="#" className="size-6">
          <InfoCircledIcon width="100%" height="100%" />
        </a>
      </HoverCard.Trigger>
    <HoverCard.Content sideOffset={5} className="HoverCardContent">
        <div className="overflow-visible wrap-break-word max-w-10/12 relative bg-theme-grey-1 flex flex-col gap-2">
          Hello world Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid ut sequi ab. In molestiae maxime facilis recusandae architecto, similique, dolore porro enim, quas perferendis voluptatum magni laudantium. Neque, debitis ipsam?
        </div>
      

      <HoverCard.Arrow className="HoverCardArrow" />
    </HoverCard.Content>
		{/* <HoverCard.Portal>
		</HoverCard.Portal> */}
	</HoverCard.Root>
  );
};


