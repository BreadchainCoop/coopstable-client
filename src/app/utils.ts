import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function truncateAddress(address: string): string {
  return address.slice(0, 6) + "..." + address.slice(-2);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageWrapClasses = "max-w-6xl m-auto px-5 sm:px-8";

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
