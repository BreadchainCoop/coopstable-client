import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getNetworkConfig, Network } from "../config";

export function truncateAddress(address: string): string {
  return address.slice(0, 6) + "..." + address.slice(-2);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageWrapClasses = "m-auto px-4 lg:px-16 xl:px-16 xl:max-w-7xl";

export const sanitizeInputValue = (inputValue: string) => {
  let hasPeriod = false;
  return inputValue
    .split("")
    .filter((i) => {
      if (!i.match(/^[0-9]*[.]?[0-9]*$/)) return false;
      // only allow first period we find
      if (i === ".") {
        if (hasPeriod) return false;
        hasPeriod = true;
      }
      return true;
    })
    .join("");
};

export function getExplorerLinkForAddress(address: string, network: Network){
  return `${getNetworkConfig(network).explorerUrl}/account/${address}`;
}